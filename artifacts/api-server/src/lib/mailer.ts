import nodemailer from "nodemailer";
import { logger } from "./logger";

const RESEND_EMAIL_ENDPOINT = "https://api.resend.com/emails";

type SendOtpEmailInput = {
  to: string;
  fullName?: string | undefined;
  otp: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getOptionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function displayName(fullName: string | undefined): string {
  const value = fullName?.trim();
  return value ? value : "there";
}

function emailDeliveryMode(): "console" | "resend" | "smtp" {
  const configured = getOptionalEnv("WAITLIST_EMAIL_DELIVERY")?.toLowerCase();

  if (configured === "console" || configured === "resend" || configured === "smtp") {
    return configured;
  }

  if (getOptionalEnv("RESEND_API_KEY")) {
    return "resend";
  }

  return "smtp";
}

export async function sendWaitlistOtpEmail({
  to,
  fullName,
  otp,
}: SendOtpEmailInput): Promise<void> {
  const from =
    getOptionalEnv("WAITLIST_EMAIL_FROM") ??
    getOptionalEnv("SMTP_FROM") ??
    getOptionalEnv("SMTP_USER");

  if (!from) {
    throw new Error("Missing WAITLIST_EMAIL_FROM or SMTP_FROM/SMTP_USER.");
  }

  const recipientName = displayName(fullName);
  const safeRecipientName = escapeHtml(recipientName);
  const subject = "Your NAIVAIDYA verification code";
  const text = `Hi ${recipientName},

Your verification code is: ${otp}

This code expires in 10 minutes.

Do not share this code with anyone.

- NAIVAIDYA Team`;
  const html = `
      <!DOCTYPE html>
      <html lang="en">
        <body style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 16px;color:#111827;background:#ffffff;">
          <h2 style="color:#7C3AED;margin-bottom:8px;">NAIVAIDYA</h2>
          <p>Hi <strong>${safeRecipientName}</strong>,</p>
          <p>Your verification code is:</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#7C3AED;padding:24px 0;">
            ${otp}
          </div>
          <p style="color:#666;font-size:14px;">
            This code expires in <strong>10 minutes</strong>.
            Do not share it with anyone.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="color:#999;font-size:12px;">- NAIVAIDYA Team</p>
        </body>
      </html>
    `;
  const mode = emailDeliveryMode();

  if (mode === "console") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("WAITLIST_EMAIL_DELIVERY=console is not allowed in production.");
    }

    logger.warn({ to, otp }, "Development waitlist OTP");
    return;
  }

  if (mode === "resend") {
    await sendWithResend({ from, to, subject, text, html });
    return;
  }

  await sendWithSmtp({ from, to, subject, text, html });
}

async function sendWithResend(input: {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<void> {
  const apiKey = requireEnv("RESEND_API_KEY");

  const response = await fetch(RESEND_EMAIL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: input.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    }),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    logger.error(
      {
        status: response.status,
        responseBody: responseBody.slice(0, 500),
      },
      "Resend rejected OTP email",
    );
    throw new Error("Unable to send OTP email.");
  }

  const data = (await response.json()) as { id?: string };
  logger.info({ messageId: data.id, provider: "resend" }, "OTP email sent");
}

async function sendWithSmtp(input: {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<void> {
  const host = requireEnv("SMTP_HOST");
  const port = Number(requireEnv("SMTP_PORT"));
  const user = requireEnv("SMTP_USER");
  const pass = normalizeSmtpPassword(host, requireEnv("SMTP_PASS"));

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a positive integer.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const info = await transporter.sendMail(input);
  logger.info({ messageId: info.messageId, provider: "smtp" }, "OTP email sent");
}

function normalizeSmtpPassword(host: string, password: string): string {
  if (host.toLowerCase().includes("gmail.com")) {
    return password.replace(/\s+/g, "");
  }

  return password;
}
