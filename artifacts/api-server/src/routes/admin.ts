import { createHmac, timingSafeEqual } from "node:crypto";
import { Router, type IRouter, type NextFunction, type Request, type Response } from "express";
import { desc, eq } from "drizzle-orm";
import { db, waitlistUsers, type WaitlistUser } from "@workspace/db";
import {
  AdminLeadStatus,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminSummaryResponse,
  AdminUpdateLeadRequest,
  AdminUpdateLeadResponse,
  AdminWaitlistUsersResponse,
  ErrorResponse,
  type AdminLeadStatusType,
  type AdminWaitlistUserType,
} from "@workspace/api-zod";
import { createRateLimiter } from "../lib/rate-limit";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const LOCAL_SESSION_SECRET = "naivaidya-local-admin-session-secret-change-before-production";
const LOGIN_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const SHORT_SESSION_MS = 12 * 60 * 60 * 1000;
const REMEMBER_SESSION_MS = 30 * 24 * 60 * 60 * 1000;

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

function adminUsername(): string {
  return process.env["ADMIN_USERNAME"]?.trim() || "admin";
}

function adminPassword(): string {
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

function signToken(payload: AdminTokenPayload): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", sessionSecret())
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

function verifyToken(token: string): AdminTokenPayload | null {
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

    if (typeof payload.sub !== "string" || typeof payload.exp !== "number") {
      return null;
    }

    if (payload.exp < Date.now()) {
      return null;
    }

    return { sub: payload.sub, exp: payload.exp };
  } catch {
    return null;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token || !verifyToken(token)) {
    sendError(res, 401, "Admin login required.");
    return;
  }

  next();
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

router.post("/admin/login", (req: Request, res: Response) => {
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
  const expectedUsername = adminUsername();

  if (input.username !== expectedUsername || !secureEqual(input.password, adminPassword())) {
    sendError(res, 401, "Invalid admin credentials.");
    return;
  }

  try {
    const ttlMs = input.remember ? REMEMBER_SESSION_MS : SHORT_SESSION_MS;
    const expiresAtMs = Date.now() + ttlMs;
    const token = signToken({ sub: expectedUsername, exp: expiresAtMs });

    res.status(200).json(
      AdminLoginResponse.parse({
        success: true,
        token,
        expiresAt: new Date(expiresAtMs).toISOString(),
        admin: { username: expectedUsername },
      }),
    );
  } catch (err) {
    logger.error({ err }, "Error creating admin session");
    sendError(res, 500, "Unable to create admin session.");
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
