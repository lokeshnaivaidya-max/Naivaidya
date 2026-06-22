ALTER TABLE "waitlist_users"
  ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'Pending' NOT NULL,
  ADD COLUMN IF NOT EXISTS "contacted" boolean DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS "notes" text DEFAULT '' NOT NULL,
  ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
