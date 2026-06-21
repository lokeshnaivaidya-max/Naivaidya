import { Router, type IRouter, type Request, type Response } from "express";
import { and, desc, eq, gt } from "drizzle-orm";
import { db, waitlistOtps, waitlistUsers } from "@workspace/db";
import {
  ErrorResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  WaitlistRequest,
  WaitlistResponse,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { sendWaitlistOtpEmail } from "../lib/mailer";
import { generateOtp, hashOtp, otpExpiresAt, otpTtlSeconds, verifyOtpHash } from "../lib/otp";
import { createRateLimiter } from "../lib/rate-limit";

const router: IRouter = Router();
const MAX_VERIFY_ATTEMPTS = 5;
const SEND_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const VERIFY_LIMIT_WINDOW_MS = 15 * 60 * 1000;

const limitOtpSendsByEmail = createRateLimiter({
  max: 5,
  windowMs: SEND_LIMIT_WINDOW_MS,
});
const limitOtpSendsByIp = createRateLimiter({
  max: 20,
  windowMs: SEND_LIMIT_WINDOW_MS,
});
const limitOtpVerificationsByEmail = createRateLimiter({
  max: 10,
  windowMs: VERIFY_LIMIT_WINDOW_MS,
});
const limitOtpVerificationsByIp = createRateLimiter({
  max: 40,
  windowMs: VERIFY_LIMIT_WINDOW_MS,
});

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

function requestIp(req: Request): string {
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

function validationError(issues: Array<{ message: string }>): string {
  return issues.map((issue) => issue.message).join(", ");
}

function sendError(res: Response, status: number, error: string): void {
  res.status(status).json(ErrorResponse.parse({ success: false, error }));
}

function sendRateLimitError(res: Response, retryAfterSeconds: number): void {
  res.setHeader("Retry-After", retryAfterSeconds.toString());
  sendError(
    res,
    429,
    `Too many attempts. Please try again in ${retryAfterSeconds} seconds.`,
  );
}

function isUniqueViolation(err: unknown): boolean {
  if (!err || typeof err !== "object") {
    return false;
  }

  const code = (err as { code?: unknown }).code;
  const causeCode = (err as { cause?: { code?: unknown } }).cause?.code;
  return code === "23505" || causeCode === "23505";
}

async function hasCompletedWaitlistRegistration(email: string): Promise<boolean> {
  const existing = await db
    .select({ id: waitlistUsers.id })
    .from(waitlistUsers)
    .where(and(eq(waitlistUsers.email, email), eq(waitlistUsers.otpVerified, true)))
    .limit(1);

  return existing.length > 0;
}

router.post("/send-otp", async (req: Request, res: Response) => {
  const parsed = SendOtpRequest.safeParse(req.body);

  if (!parsed.success) {
    sendError(res, 400, validationError(parsed.error.issues));
    return;
  }

  const input = parsed.data;
  const ip = requestIp(req);
  const emailLimit = limitOtpSendsByEmail(input.email);
  const ipLimit = limitOtpSendsByIp(ip);

  if (!emailLimit.allowed || !ipLimit.allowed) {
    sendRateLimitError(
      res,
      Math.max(emailLimit.retryAfterSeconds, ipLimit.retryAfterSeconds),
    );
    return;
  }

  try {
    if (await hasCompletedWaitlistRegistration(input.email)) {
      sendError(res, 409, "This email is already registered on the waitlist.");
      return;
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = otpExpiresAt();
    const [createdOtp] = await db
      .insert(waitlistOtps)
      .values({
        email: input.email,
        otpHash,
        expiresAt,
      })
      .returning({ id: waitlistOtps.id });

    try {
      await sendWaitlistOtpEmail({
        to: input.email,
        fullName: input.fullName,
        otp,
      });
    } catch (err) {
      if (createdOtp) {
        await db
          .update(waitlistOtps)
          .set({ consumed: true, consumedAt: new Date() })
          .where(eq(waitlistOtps.id, createdOtp.id));
      }

      throw err;
    }

    res.status(200).json(
      SendOtpResponse.parse({
        success: true,
        message: "Verification code sent to your email.",
        expiresInSeconds: otpTtlSeconds(),
      }),
    );
  } catch (err) {
    logger.error({ err }, "Error sending waitlist OTP");
    sendError(res, 500, "Unable to send verification code.");
  }
});

router.post("/verify-otp", async (req: Request, res: Response) => {
  const parsed = VerifyOtpRequest.safeParse(req.body);

  if (!parsed.success) {
    sendError(res, 400, validationError(parsed.error.issues));
    return;
  }

  const { email, otp } = parsed.data;
  const ip = requestIp(req);
  const emailLimit = limitOtpVerificationsByEmail(email);
  const ipLimit = limitOtpVerificationsByIp(ip);

  if (!emailLimit.allowed || !ipLimit.allowed) {
    sendRateLimitError(
      res,
      Math.max(emailLimit.retryAfterSeconds, ipLimit.retryAfterSeconds),
    );
    return;
  }

  try {
    const now = new Date();
    const [record] = await db
      .select()
      .from(waitlistOtps)
      .where(
        and(
          eq(waitlistOtps.email, email),
          eq(waitlistOtps.consumed, false),
          gt(waitlistOtps.expiresAt, now),
        ),
      )
      .orderBy(desc(waitlistOtps.createdAt))
      .limit(1);

    if (!record) {
      sendError(res, 400, "Invalid or expired OTP. Please request a new code.");
      return;
    }

    if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
      await db
        .update(waitlistOtps)
        .set({ consumed: true, consumedAt: now })
        .where(eq(waitlistOtps.id, record.id));
      sendError(res, 429, "Too many invalid attempts. Please request a new OTP.");
      return;
    }

    const attempts = record.attempts + 1;
    const isValidOtp = verifyOtpHash(otp, record.otpHash);

    if (!isValidOtp) {
      await db
        .update(waitlistOtps)
        .set({
          attempts,
          consumed: attempts >= MAX_VERIFY_ATTEMPTS,
          consumedAt: attempts >= MAX_VERIFY_ATTEMPTS ? now : null,
        })
        .where(eq(waitlistOtps.id, record.id));

      sendError(
        res,
        attempts >= MAX_VERIFY_ATTEMPTS ? 429 : 400,
        attempts >= MAX_VERIFY_ATTEMPTS
          ? "Too many invalid attempts. Please request a new OTP."
          : "Invalid OTP. Please try again.",
      );
      return;
    }

    await db
      .update(waitlistOtps)
      .set({ attempts, verified: true, verifiedAt: now })
      .where(eq(waitlistOtps.id, record.id));

    res.status(200).json(
      VerifyOtpResponse.parse({
        success: true,
        message: "Email verified. Complete registration to join the waitlist.",
        expiresInSeconds: Math.max(
          1,
          Math.ceil((record.expiresAt.getTime() - now.getTime()) / 1000),
        ),
      }),
    );
  } catch (err) {
    logger.error({ err }, "Error verifying waitlist OTP");
    sendError(res, 500, "Unable to verify OTP.");
  }
});

router.post("/waitlist", async (req: Request, res: Response) => {
  const parsed = WaitlistRequest.safeParse(req.body);

  if (!parsed.success) {
    sendError(res, 400, validationError(parsed.error.issues));
    return;
  }

  const input = parsed.data;

  try {
    const created = await db.transaction(async (tx) => {
      const now = new Date();
      const [existingUser] = await tx
        .select({ id: waitlistUsers.id })
        .from(waitlistUsers)
        .where(eq(waitlistUsers.email, input.email))
        .limit(1);

      if (existingUser) {
        throw new HttpError(409, "This email is already registered on the waitlist.");
      }

      const [verification] = await tx
        .select()
        .from(waitlistOtps)
        .where(
          and(
            eq(waitlistOtps.email, input.email),
            eq(waitlistOtps.verified, true),
            eq(waitlistOtps.consumed, false),
            gt(waitlistOtps.expiresAt, now),
          ),
        )
        .orderBy(desc(waitlistOtps.verifiedAt), desc(waitlistOtps.createdAt))
        .limit(1);

      if (!verification) {
        throw new HttpError(403, "Please verify your email before joining the waitlist.");
      }

      const [user] = await tx
        .insert(waitlistUsers)
        .values({
          fullName: input.fullName,
          email: input.email,
          mobile: input.mobile,
          city: input.city,
          message: input.message,
          otpVerified: true,
        })
        .returning({ id: waitlistUsers.id });

      await tx
        .update(waitlistOtps)
        .set({ consumed: true, consumedAt: now })
        .where(eq(waitlistOtps.id, verification.id));

      return user;
    });

    if (!created) {
      throw new Error("Waitlist insert did not return a created user.");
    }

    res.status(201).json(
      WaitlistResponse.parse({
        success: true,
        message: "You're on the NAIVAIDYA waitlist.",
        id: created.id,
      }),
    );
  } catch (err) {
    if (err instanceof HttpError) {
      sendError(res, err.status, err.message);
      return;
    }

    if (isUniqueViolation(err)) {
      sendError(res, 409, "This email is already registered on the waitlist.");
      return;
    }

    logger.error({ err }, "Error creating waitlist user");
    sendError(res, 500, "Unable to join the waitlist.");
  }
});

export default router;
