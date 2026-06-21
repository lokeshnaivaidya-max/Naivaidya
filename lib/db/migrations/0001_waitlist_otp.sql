CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "waitlist_users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "full_name" text NOT NULL,
  "email" text NOT NULL,
  "mobile" text NOT NULL,
  "city" text NOT NULL,
  "message" text DEFAULT '' NOT NULL,
  "otp_verified" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "waitlist_users_email_unique"
  ON "waitlist_users" ("email");

CREATE TABLE IF NOT EXISTS "waitlist_otps" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "otp_hash" text NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "attempts" integer DEFAULT 0 NOT NULL,
  "verified" boolean DEFAULT false NOT NULL,
  "consumed" boolean DEFAULT false NOT NULL,
  "verified_at" timestamp with time zone,
  "consumed_at" timestamp with time zone
);

CREATE INDEX IF NOT EXISTS "waitlist_otps_email_created_at_idx"
  ON "waitlist_otps" ("email", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "waitlist_otps_email_verified_idx"
  ON "waitlist_otps" ("email", "verified", "consumed", "expires_at");
