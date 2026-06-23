CREATE TABLE IF NOT EXISTS "admin_accounts" (
  "id" text PRIMARY KEY DEFAULT 'primary' NOT NULL,
  "username" text NOT NULL,
  "password_hash" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "admin_accounts_username_unique"
  ON "admin_accounts" ("username");
