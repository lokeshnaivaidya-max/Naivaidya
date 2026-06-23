import {
  createHmac,
  randomBytes,
  randomUUID,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { Router, type IRouter, type NextFunction, type Request, type Response } from "express";
import { desc, eq } from "drizzle-orm";
import {
  adminAccounts,
  db,
  waitlistUsers,
  type AdminAccount,
  type WaitlistUser,
} from "@workspace/db";
import {
  AdminLeadStatus,
  AdminAccountsResponse,
  AdminCreateAccountRequest,
  AdminCreateAccountResponse,
  AdminDeleteAccountRequest,
  AdminDeleteAccountResponse,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminProfileResponse,
  AdminSummaryResponse,
  AdminUpdateCredentialsRequest,
  AdminUpdateCredentialsResponse,
  AdminUpdateLeadRequest,
  AdminUpdateLeadResponse,
  AdminWaitlistUsersResponse,
  ErrorResponse,
  type AdminAccountSummaryType,
  type AdminLeadStatusType,
  type AdminWaitlistUserType,
} from "@workspace/api-zod";
import { createRateLimiter } from "../lib/rate-limit";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const scryptAsync = promisify(scryptCallback);

const ADMIN_ACCOUNT_ID = "primary";
const LOCAL_SESSION_SECRET = "naivaidya-local-admin-session-secret-change-before-production";
const LOGIN_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const SHORT_SESSION_MS = 12 * 60 * 60 * 1000;
const REMEMBER_SESSION_MS = 30 * 24 * 60 * 60 * 1000;
const PASSWORD_KEY_LENGTH = 64;

const STATUSES: AdminLeadStatusType[] = [
  "Pending",
  "Contacted",
  "Interested",
  "Follow Up Required",
  "Not Interested",
];

const limitAdminLoginsByIp = createRateLimiter({
  max: 20,
  windowMs: LOGIN_LIMIT_WINDOW_MS,
});

type AdminTokenPayload = {
  sub: string;
  exp: number;
  credentialUpdatedAt: string;
};

function requestIp(req: Request): string {
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

function validationError(issues: Array<{ message: string }>): string {
  return issues.map((issue) => issue.message).join(", ");
}

function sendError(res: Response, status: number, error: string): void {
  res.status(status).json(ErrorResponse.parse({ success: false, error }));
}

function bootstrapAdminUsername(): string {
  return process.env["ADMIN_USERNAME"]?.trim() || "admin";
}

function bootstrapAdminPassword(): string {
  return process.env["ADMIN_PASSWORD"] || "admin123";
}

function sessionSecret(): string {
  const secret = process.env["ADMIN_SESSION_SECRET"]?.trim();

  if (secret) {
    return secret;
  }

  if (process.env["NODE_ENV"] === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be set in production.");
  }

  return LOCAL_SESSION_SECRET;
}

function secureEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(24).toString("base64url");
  const key = (await scryptAsync(password, salt, PASSWORD_KEY_LENGTH)) as Buffer;
  return `scrypt:${salt}:${key.toString("base64url")}`;
}

async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  const [algorithm, salt, storedKey] = passwordHash.split(":");

  if (algorithm !== "scrypt" || !salt || !storedKey) {
    return false;
  }

  const storedKeyBuffer = Buffer.from(storedKey, "base64url");
  const derivedKey = (await scryptAsync(password, salt, storedKeyBuffer.length)) as Buffer;

  if (derivedKey.length !== storedKeyBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, storedKeyBuffer);
}

async function getAdminAccount(): Promise<AdminAccount | null> {
  return getAdminAccountById(ADMIN_ACCOUNT_ID);
}

async function getAdminAccountById(id: string): Promise<AdminAccount | null> {
  const [account] = await db
    .select()
    .from(adminAccounts)
    .where(eq(adminAccounts.id, id))
    .limit(1);

  return account ?? null;
}

async function getAdminAccountByUsername(username: string): Promise<AdminAccount | null> {
  const [account] = await db
    .select()
    .from(adminAccounts)
    .where(eq(adminAccounts.username, username))
    .limit(1);

  return account ?? null;
}

async function getAdminAccounts(): Promise<AdminAccount[]> {
  return db.select().from(adminAccounts).orderBy(desc(adminAccounts.createdAt));
}

async function createBootstrapAdminAccount(username: string, password: string): Promise<AdminAccount> {
  const passwordHash = await hashPassword(password);
  const [created] = await db
    .insert(adminAccounts)
    .values({
      id: ADMIN_ACCOUNT_ID,
      username,
      passwordHash,
    })
    .onConflictDoNothing()
    .returning();

  if (created) {
    return created;
  }

  const existing = await getAdminAccount();

  if (!existing) {
    throw new Error("Admin account bootstrap failed.");
  }

  return existing;
}

function signToken(payload: AdminTokenPayload): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", sessionSecret())
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

function verifySignedToken(token: string): AdminTokenPayload | null {
  const [encodedPayload, signature, extra] = token.split(".");

  if (!encodedPayload || !signature || extra !== undefined) {
    return null;
  }

  const expectedSignature = createHmac("sha256", sessionSecret())
    .update(encodedPayload)
    .digest("base64url");

  if (!secureEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as Partial<AdminTokenPayload>;

    if (
      typeof payload.sub !== "string" ||
      typeof payload.exp !== "number" ||
      typeof payload.credentialUpdatedAt !== "string"
    ) {
      return null;
    }

    if (payload.exp < Date.now()) {
      return null;
    }

    return {
      sub: payload.sub,
      exp: payload.exp,
      credentialUpdatedAt: payload.credentialUpdatedAt,
    };
  } catch {
    return null;
  }
}

function issueAdminSession(account: AdminAccount, remember: boolean) {
  const ttlMs = remember ? REMEMBER_SESSION_MS : SHORT_SESSION_MS;
  const expiresAtMs = Date.now() + ttlMs;
  const token = signToken({
    sub: account.id,
    exp: expiresAtMs,
    credentialUpdatedAt: account.updatedAt.toISOString(),
  });

  return {
    token,
    expiresAt: new Date(expiresAtMs).toISOString(),
  };
}

function adminFromAccount(account: AdminAccount) {
  return {
    id: account.id,
    username: account.username,
    updatedAt: account.updatedAt.toISOString(),
  };
}

function adminSummaryFromAccount(account: AdminAccount, currentAdminId: string): AdminAccountSummaryType {
  return {
    id: account.id,
    username: account.username,
    createdAt: account.createdAt.toISOString(),
    updatedAt: account.updatedAt.toISOString(),
    isCurrent: account.id === currentAdminId,
  };
}

function isUniqueViolation(err: unknown): boolean {
  if (!err || typeof err !== "object") {
    return false;
  }

  const code = (err as { code?: unknown }).code;
  const causeCode = (err as { cause?: { code?: unknown } }).cause?.code;
  return code === "23505" || causeCode === "23505";
}

async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    sendError(res, 401, "Admin login required.");
    return;
  }

  try {
    const payload = verifySignedToken(token);
    const account = payload ? await getAdminAccountById(payload.sub) : null;

    if (
      !payload ||
      !account ||
      payload.credentialUpdatedAt !== account.updatedAt.toISOString()
    ) {
      sendError(res, 401, "Admin login required.");
      return;
    }

    (res.locals as { adminAccount?: AdminAccount }).adminAccount = account;
    next();
  } catch (err) {
    logger.error({ err }, "Error verifying admin session");
    sendError(res, 500, "Unable to verify admin session.");
  }
}

function normalizedStatus(value: string): AdminLeadStatusType {
  const parsed = AdminLeadStatus.safeParse(value);
  return parsed.success ? parsed.data : "Pending";
}

function toAdminUser(user: WaitlistUser): AdminWaitlistUserType {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    mobile: user.mobile,
    city: user.city,
    message: user.message,
    status: normalizedStatus(user.status),
    contacted: user.contacted,
    notes: user.notes,
    otpVerified: user.otpVerified,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

function startOfLocalDay(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

router.post("/admin/login", async (req: Request, res: Response) => {
  const ipLimit = limitAdminLoginsByIp(requestIp(req));

  if (!ipLimit.allowed) {
    res.setHeader("Retry-After", ipLimit.retryAfterSeconds.toString());
    sendError(
      res,
      429,
      `Too many login attempts. Please try again in ${ipLimit.retryAfterSeconds} seconds.`,
    );
    return;
  }

  const parsed = AdminLoginRequest.safeParse(req.body);

  if (!parsed.success) {
    sendError(res, 400, validationError(parsed.error.issues));
    return;
  }

  const input = parsed.data;

  try {
    let account = await getAdminAccountByUsername(input.username);

    if (!account) {
      const existingAccounts = await getAdminAccounts();

      if (
        existingAccounts.length > 0 ||
        input.username !== bootstrapAdminUsername() ||
        !secureEqual(input.password, bootstrapAdminPassword())
      ) {
        sendError(res, 401, "Invalid admin credentials.");
        return;
      }

      account = await createBootstrapAdminAccount(input.username, input.password);
    } else if (
      input.username !== account.username ||
      !(await verifyPassword(input.password, account.passwordHash))
    ) {
      sendError(res, 401, "Invalid admin credentials.");
      return;
    }

    const session = issueAdminSession(account, input.remember);

    res.status(200).json(
      AdminLoginResponse.parse({
        success: true,
        token: session.token,
        expiresAt: session.expiresAt,
        admin: { username: account.username },
      }),
    );
  } catch (err) {
    logger.error({ err }, "Error creating admin session");
    sendError(res, 500, "Unable to create admin session.");
  }
});

router.get("/admin/admins", requireAdmin, async (_req: Request, res: Response) => {
  const account = (res.locals as { adminAccount?: AdminAccount }).adminAccount;

  if (!account) {
    sendError(res, 401, "Admin login required.");
    return;
  }

  try {
    const accounts = await getAdminAccounts();

    res.status(200).json(
      AdminAccountsResponse.parse({
        success: true,
        admins: accounts.map((admin) => adminSummaryFromAccount(admin, account.id)),
      }),
    );
  } catch (err) {
    logger.error({ err }, "Error loading admin accounts");
    sendError(res, 500, "Unable to load admin accounts.");
  }
});

router.post("/admin/admins", requireAdmin, async (req: Request, res: Response) => {
  const account = (res.locals as { adminAccount?: AdminAccount }).adminAccount;

  if (!account) {
    sendError(res, 401, "Admin login required.");
    return;
  }

  const parsed = AdminCreateAccountRequest.safeParse(req.body);

  if (!parsed.success) {
    sendError(res, 400, validationError(parsed.error.issues));
    return;
  }

  const input = parsed.data;

  try {
    if (!(await verifyPassword(input.currentPassword, account.passwordHash))) {
      sendError(res, 401, "Current password is incorrect.");
      return;
    }

    const [created] = await db
      .insert(adminAccounts)
      .values({
        id: randomUUID(),
        username: input.username,
        passwordHash: await hashPassword(input.password),
      })
      .returning();

    if (!created) {
      sendError(res, 500, "Unable to create admin account.");
      return;
    }

    res.status(201).json(
      AdminCreateAccountResponse.parse({
        success: true,
        message: "Admin account created.",
        admin: adminSummaryFromAccount(created, account.id),
      }),
    );
  } catch (err) {
    if (isUniqueViolation(err)) {
      sendError(res, 409, "That admin username already exists.");
      return;
    }

    logger.error({ err }, "Error creating admin account");
    sendError(res, 500, "Unable to create admin account.");
  }
});

router.delete("/admin/admins/:id", requireAdmin, async (req: Request, res: Response) => {
  const account = (res.locals as { adminAccount?: AdminAccount }).adminAccount;
  const idParam = req.params["id"];
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!account) {
    sendError(res, 401, "Admin login required.");
    return;
  }

  if (!id) {
    sendError(res, 400, "Admin id is required.");
    return;
  }

  const parsed = AdminDeleteAccountRequest.safeParse(req.body);

  if (!parsed.success) {
    sendError(res, 400, validationError(parsed.error.issues));
    return;
  }

  try {
    if (!(await verifyPassword(parsed.data.currentPassword, account.passwordHash))) {
      sendError(res, 401, "Current password is incorrect.");
      return;
    }

    if (id === account.id) {
      sendError(res, 400, "You cannot remove the admin account you are currently using.");
      return;
    }

    const accounts = await getAdminAccounts();

    if (accounts.length <= 1) {
      sendError(res, 400, "At least one admin account must remain.");
      return;
    }

    const [deleted] = await db
      .delete(adminAccounts)
      .where(eq(adminAccounts.id, id))
      .returning({ id: adminAccounts.id });

    if (!deleted) {
      sendError(res, 404, "Admin account was not found.");
      return;
    }

    res.status(200).json(
      AdminDeleteAccountResponse.parse({
        success: true,
        message: "Admin account removed.",
        deletedId: deleted.id,
      }),
    );
  } catch (err) {
    logger.error({ err }, "Error deleting admin account");
    sendError(res, 500, "Unable to delete admin account.");
  }
});

router.get("/admin/profile", requireAdmin, async (_req: Request, res: Response) => {
  const account = (res.locals as { adminAccount?: AdminAccount }).adminAccount;

  if (!account) {
    sendError(res, 401, "Admin login required.");
    return;
  }

  res.status(200).json(
    AdminProfileResponse.parse({
      success: true,
      admin: adminFromAccount(account),
    }),
  );
});

router.patch("/admin/credentials", requireAdmin, async (req: Request, res: Response) => {
  const account = (res.locals as { adminAccount?: AdminAccount }).adminAccount;

  if (!account) {
    sendError(res, 401, "Admin login required.");
    return;
  }

  const parsed = AdminUpdateCredentialsRequest.safeParse(req.body);

  if (!parsed.success) {
    sendError(res, 400, validationError(parsed.error.issues));
    return;
  }

  const input = parsed.data;

  try {
    if (!(await verifyPassword(input.currentPassword, account.passwordHash))) {
      sendError(res, 401, "Current password is incorrect.");
      return;
    }

    const nextUsername = input.username ?? account.username;
    const updateValues: {
      username: string;
      passwordHash?: string;
      updatedAt: Date;
    } = {
      username: nextUsername,
      updatedAt: new Date(),
    };

    if (input.newPassword) {
      updateValues.passwordHash = await hashPassword(input.newPassword);
    }

    const [updated] = await db
      .update(adminAccounts)
      .set(updateValues)
      .where(eq(adminAccounts.id, account.id))
      .returning();

    if (!updated) {
      sendError(res, 404, "Admin account was not found.");
      return;
    }

    const session = issueAdminSession(updated, input.remember);

    res.status(200).json(
      AdminUpdateCredentialsResponse.parse({
        success: true,
        message: "Admin credentials updated.",
        token: session.token,
        expiresAt: session.expiresAt,
        admin: adminFromAccount(updated),
      }),
    );
  } catch (err) {
    if (isUniqueViolation(err)) {
      sendError(res, 409, "That admin username already exists.");
      return;
    }

    logger.error({ err }, "Error updating admin credentials");
    sendError(res, 500, "Unable to update admin credentials.");
  }
});

router.get("/admin/summary", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(waitlistUsers)
      .orderBy(desc(waitlistUsers.createdAt));
    const users = rows.map(toAdminUser);
    const byStatus = Object.fromEntries(STATUSES.map((status) => [status, 0])) as Record<AdminLeadStatusType, number>;
    const today = startOfLocalDay();

    for (const user of users) {
      byStatus[user.status] += 1;
    }

    res.status(200).json(
      AdminSummaryResponse.parse({
        success: true,
        total: users.length,
        verified: users.filter((user) => user.otpVerified).length,
        contacted: users.filter((user) => user.contacted).length,
        uncontacted: users.filter((user) => !user.contacted).length,
        registeredToday: rows.filter((user) => user.createdAt >= today).length,
        latestRegistrationAt: users[0]?.createdAt ?? null,
        byStatus,
      }),
    );
  } catch (err) {
    logger.error({ err }, "Error loading admin summary");
    sendError(res, 500, "Unable to load admin summary.");
  }
});

router.get("/admin/waitlist-users", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const users = await db
      .select()
      .from(waitlistUsers)
      .orderBy(desc(waitlistUsers.createdAt));

    res.status(200).json(
      AdminWaitlistUsersResponse.parse({
        success: true,
        users: users.map(toAdminUser),
      }),
    );
  } catch (err) {
    logger.error({ err }, "Error loading waitlist users");
    sendError(res, 500, "Unable to load waitlist users.");
  }
});

router.patch("/admin/waitlist-users/:id", requireAdmin, async (req: Request, res: Response) => {
  const idParam = req.params["id"];
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id) {
    sendError(res, 400, "Lead id is required.");
    return;
  }

  const parsed = AdminUpdateLeadRequest.safeParse(req.body);

  if (!parsed.success) {
    sendError(res, 400, validationError(parsed.error.issues));
    return;
  }

  try {
    const update = {
      ...parsed.data,
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(waitlistUsers)
      .set(update)
      .where(eq(waitlistUsers.id, id))
      .returning();

    if (!updated) {
      sendError(res, 404, "Waitlist user was not found.");
      return;
    }

    res.status(200).json(
      AdminUpdateLeadResponse.parse({
        success: true,
        user: toAdminUser(updated),
      }),
    );
  } catch (err) {
    logger.error({ err }, "Error updating waitlist user");
    sendError(res, 500, "Unable to update waitlist user.");
  }
});

export default router;
