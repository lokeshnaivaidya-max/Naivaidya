import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const adminAccounts = pgTable("admin_accounts", {
  id: text("id").notNull().default("primary").primaryKey(),
  username: text("username").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("admin_accounts_username_unique").on(table.username),
]);

export type AdminAccount = typeof adminAccounts.$inferSelect;
