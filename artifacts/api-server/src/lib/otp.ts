import { pbkdf2Sync, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 10;
const PBKDF2_DIGEST = "sha256";
const PBKDF2_ITERATIONS = 210_000;
const PBKDF2_KEY_LENGTH = 32;
const HASH_PREFIX = "pbkdf2_sha256";

export function generateOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(OTP_LENGTH, "0");
}

export function hashOtp(otp: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(
    otp,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_KEY_LENGTH,
    PBKDF2_DIGEST,
  ).toString("hex");

  return `${HASH_PREFIX}$${PBKDF2_ITERATIONS}$${salt}$${hash}`;
}

export function verifyOtpHash(otp: string, storedHash: string): boolean {
  const [prefix, rawIterations, salt, expectedHash] = storedHash.split("$");

  if (prefix !== HASH_PREFIX || !rawIterations || !salt || !expectedHash) {
    return false;
  }

  const iterations = Number(rawIterations);

  if (!Number.isInteger(iterations) || iterations <= 0) {
    return false;
  }

  const calculatedHash = pbkdf2Sync(
    otp,
    salt,
    iterations,
    Buffer.from(expectedHash, "hex").length,
    PBKDF2_DIGEST,
  );
  const expectedHashBuffer = Buffer.from(expectedHash, "hex");

  if (calculatedHash.length !== expectedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(calculatedHash, expectedHashBuffer);
}

export function otpExpiresAt(now = new Date()): Date {
  return new Date(now.getTime() + OTP_TTL_MINUTES * 60 * 1000);
}

export function otpTtlSeconds(): number {
  return OTP_TTL_MINUTES * 60;
}
