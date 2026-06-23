import { z } from "zod/v4";

const normalizedEmail = z
  .string()
  .trim()
  .email("Valid email is required")
  .transform((value) => value.toLowerCase());

const optionalTrimmedText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value ?? "");

export const SendOtpRequest = z.object({
  email: normalizedEmail,
  fullName: optionalTrimmedText(100),
  mobile: optionalTrimmedText(30),
  city: optionalTrimmedText(80),
  message: optionalTrimmedText(1_000),
});

export const VerifyOtpRequest = z.object({
  email: normalizedEmail,
  otp: z.string().trim().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const WaitlistRequest = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  email: normalizedEmail,
  mobile: z
    .string()
    .trim()
    .min(7, "Valid mobile number is required")
    .max(30)
    .regex(/^\+?[0-9\s().-]+$/, "Mobile number can only include digits and common separators"),
  city: z.string().trim().min(2, "City is required").max(80),
  message: z.string().trim().max(1_000).optional().default(""),
});

export const SendOtpResponse = z.object({
  success: z.literal(true),
  message: z.string(),
  expiresInSeconds: z.number().int().positive(),
});

export const VerifyOtpResponse = z.object({
  success: z.literal(true),
  message: z.string(),
  expiresInSeconds: z.number().int().positive(),
});

export const WaitlistResponse = z.object({
  success: z.literal(true),
  message: z.string(),
  id: z.string(),
});

export const ErrorResponse = z.object({
  success: z.literal(false),
  error: z.string(),
});

export type SendOtpRequestType = z.infer<typeof SendOtpRequest>;
export type VerifyOtpRequestType = z.infer<typeof VerifyOtpRequest>;
export type WaitlistRequestType = z.infer<typeof WaitlistRequest>;
export type SendOtpResponseType = z.infer<typeof SendOtpResponse>;
export type VerifyOtpResponseType = z.infer<typeof VerifyOtpResponse>;
export type WaitlistResponseType = z.infer<typeof WaitlistResponse>;
export type ErrorResponseType = z.infer<typeof ErrorResponse>;
