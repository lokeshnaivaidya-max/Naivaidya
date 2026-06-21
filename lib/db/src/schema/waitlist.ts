import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const waitlistUsers = pgTable("waitlist_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  mobile: text("mobile").notNull(),
  city: text("city").notNull(),
  message: text("message").notNull().default(""),
  otpVerified: boolean("otp_verified").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("waitlist_users_email_unique").on(table.email),
]);

export const waitlistOtps = pgTable("waitlist_otps", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  otpHash: text("otp_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  attempts: integer("attempts").notNull().default(0),
  verified: boolean("verified").notNull().default(false),
  consumed: boolean("consumed").notNull().default(false),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
}, (table) => [
  index("waitlist_otps_email_created_at_idx").on(table.email, table.createdAt),
  index("waitlist_otps_email_verified_idx").on(
    table.email,
    table.verified,
    table.consumed,
    table.expiresAt,
  ),
]);

export const insertWaitlistUserSchema = createInsertSchema(waitlistUsers).omit({
  id: true,
  otpVerified: true,
  createdAt: true,
});

export const insertWaitlistOtpSchema = createInsertSchema(waitlistOtps).omit({
  id: true,
  createdAt: true,
  attempts: true,
  verified: true,
  consumed: true,
  verifiedAt: true,
  consumedAt: true,
});

export type InsertWaitlistUser = z.infer<typeof insertWaitlistUserSchema>;
export type WaitlistUser = typeof waitlistUsers.$inferSelect;
export type InsertWaitlistOtp = z.infer<typeof insertWaitlistOtpSchema>;
export type WaitlistOtp = typeof waitlistOtps.$inferSelect;
