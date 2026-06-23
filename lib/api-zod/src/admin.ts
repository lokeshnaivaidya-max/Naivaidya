import { z } from "zod/v4";

export const AdminLeadStatus = z.enum([
  "Pending",
  "Contacted",
  "Interested",
  "Follow Up Required",
  "Not Interested",
]);

export const AdminLoginRequest = z.object({
  username: z.string().trim().min(1, "Username is required").max(80),
  password: z.string().min(1, "Password is required").max(200),
  remember: z.boolean().optional().default(false),
});

export const AdminLoginResponse = z.object({
  success: z.literal(true),
  token: z.string(),
  expiresAt: z.string(),
  admin: z.object({
    username: z.string(),
  }),
});

export const AdminProfileResponse = z.object({
  success: z.literal(true),
  admin: z.object({
    id: z.string(),
    username: z.string(),
    updatedAt: z.string(),
  }),
});

export const AdminAccountSummary = z.object({
  id: z.string(),
  username: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isCurrent: z.boolean(),
});

export const AdminAccountsResponse = z.object({
  success: z.literal(true),
  admins: z.array(AdminAccountSummary),
});

export const AdminWaitlistUser = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  mobile: z.string(),
  city: z.string(),
  message: z.string(),
  status: AdminLeadStatus,
  contacted: z.boolean(),
  notes: z.string(),
  otpVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AdminStatusCounts = z.object({
  Pending: z.number().int().nonnegative(),
  Contacted: z.number().int().nonnegative(),
  Interested: z.number().int().nonnegative(),
  "Follow Up Required": z.number().int().nonnegative(),
  "Not Interested": z.number().int().nonnegative(),
});

export const AdminSummaryResponse = z.object({
  success: z.literal(true),
  total: z.number().int().nonnegative(),
  verified: z.number().int().nonnegative(),
  contacted: z.number().int().nonnegative(),
  uncontacted: z.number().int().nonnegative(),
  registeredToday: z.number().int().nonnegative(),
  latestRegistrationAt: z.string().nullable(),
  byStatus: AdminStatusCounts,
});

export const AdminWaitlistUsersResponse = z.object({
  success: z.literal(true),
  users: z.array(AdminWaitlistUser),
});

export const AdminUpdateLeadRequest = z.object({
  status: AdminLeadStatus.optional(),
  contacted: z.boolean().optional(),
  notes: z.string().trim().max(2_000).optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required.",
});

export const AdminUpdateLeadResponse = z.object({
  success: z.literal(true),
  user: AdminWaitlistUser,
});

export const AdminUpdateCredentialsRequest = z.object({
  currentPassword: z.string().min(1, "Current password is required").max(200),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(80)
    .regex(/^[a-zA-Z0-9._-]+$/, "Username can use letters, numbers, dot, dash, and underscore")
    .optional(),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(200)
    .optional(),
  remember: z.boolean().optional().default(false),
}).refine((value) => Boolean(value.username || value.newPassword), {
  message: "Username or new password is required.",
});

export const AdminUpdateCredentialsResponse = z.object({
  success: z.literal(true),
  message: z.string(),
  token: z.string(),
  expiresAt: z.string(),
  admin: z.object({
    id: z.string(),
    username: z.string(),
    updatedAt: z.string(),
  }),
});

export const AdminCreateAccountRequest = z.object({
  currentPassword: z.string().min(1, "Current password is required").max(200),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(80)
    .regex(/^[a-zA-Z0-9._-]+$/, "Username can use letters, numbers, dot, dash, and underscore"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export const AdminCreateAccountResponse = z.object({
  success: z.literal(true),
  message: z.string(),
  admin: AdminAccountSummary,
});

export const AdminDeleteAccountRequest = z.object({
  currentPassword: z.string().min(1, "Current password is required").max(200),
});

export const AdminDeleteAccountResponse = z.object({
  success: z.literal(true),
  message: z.string(),
  deletedId: z.string(),
});

export type AdminLeadStatusType = z.infer<typeof AdminLeadStatus>;
export type AdminLoginRequestType = z.infer<typeof AdminLoginRequest>;
export type AdminLoginResponseType = z.infer<typeof AdminLoginResponse>;
export type AdminProfileResponseType = z.infer<typeof AdminProfileResponse>;
export type AdminAccountSummaryType = z.infer<typeof AdminAccountSummary>;
export type AdminAccountsResponseType = z.infer<typeof AdminAccountsResponse>;
export type AdminWaitlistUserType = z.infer<typeof AdminWaitlistUser>;
export type AdminSummaryResponseType = z.infer<typeof AdminSummaryResponse>;
export type AdminWaitlistUsersResponseType = z.infer<typeof AdminWaitlistUsersResponse>;
export type AdminUpdateLeadRequestType = z.infer<typeof AdminUpdateLeadRequest>;
export type AdminUpdateLeadResponseType = z.infer<typeof AdminUpdateLeadResponse>;
export type AdminUpdateCredentialsRequestType = z.infer<typeof AdminUpdateCredentialsRequest>;
export type AdminUpdateCredentialsResponseType = z.infer<typeof AdminUpdateCredentialsResponse>;
export type AdminCreateAccountRequestType = z.infer<typeof AdminCreateAccountRequest>;
export type AdminCreateAccountResponseType = z.infer<typeof AdminCreateAccountResponse>;
export type AdminDeleteAccountRequestType = z.infer<typeof AdminDeleteAccountRequest>;
export type AdminDeleteAccountResponseType = z.infer<typeof AdminDeleteAccountResponse>;
