import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  KeyRound,
  Loader2,
  LogOut,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import naivaidyaLogo from "@assets/naivaidya_logo.jpg";

type Status = "Pending" | "Contacted" | "Interested" | "Follow Up Required" | "Not Interested";

type Lead = {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  message: string;
  status: Status;
  contacted: boolean;
  notes: string;
  otpVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type Summary = {
  success: true;
  total: number;
  verified: number;
  contacted: number;
  uncontacted: number;
  registeredToday: number;
  latestRegistrationAt: string | null;
  byStatus: Record<Status, number>;
};

type UsersResponse = {
  success: true;
  users: Lead[];
};

type ProfileResponse = {
  success: true;
  admin: {
    id: string;
    username: string;
    updatedAt: string;
  };
};

type AdminAccountSummary = {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  isCurrent: boolean;
};

type AdminAccountsResponse = {
  success: true;
  admins: AdminAccountSummary[];
};

type UpdateLeadResponse = {
  success: true;
  user: Lead;
};

type UpdateCredentialsResponse = {
  success: true;
  message: string;
  token: string;
  expiresAt: string;
  admin: {
    id: string;
    username: string;
    updatedAt: string;
  };
};

type CreateAdminResponse = {
  success: true;
  message: string;
  admin: AdminAccountSummary;
};

type DeleteAdminResponse = {
  success: true;
  message: string;
  deletedId: string;
};

type ApiErrorBody = {
  success: false;
  error: string;
};

type AdminSession = {
  token: string;
  expiresAt: string;
  username: string;
};

type CredentialForm = {
  username: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type NewAdminForm = {
  username: string;
  password: string;
  confirmPassword: string;
  currentPassword: string;
};

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const ADMIN_SESSION_KEY = "naivaidya_admin_session";
const STATUSES: Status[] = ["Pending", "Contacted", "Interested", "Follow Up Required", "Not Interested"];

const STATUS_COLORS: Record<Status, string> = {
  Pending: "bg-gray-100 text-gray-600",
  Contacted: "bg-blue-100 text-blue-700",
  Interested: "bg-green-100 text-green-700",
  "Follow Up Required": "bg-amber-100 text-amber-700",
  "Not Interested": "bg-red-100 text-red-600",
};

const STATUS_DOT: Record<Status, string> = {
  Pending: "bg-gray-400",
  Contacted: "bg-blue-500",
  Interested: "bg-green-500",
  "Follow Up Required": "bg-amber-500",
  "Not Interested": "bg-red-500",
};

function readAdminSession(): AdminSession | null {
  const rawSession = sessionStorage.getItem(ADMIN_SESSION_KEY) ?? localStorage.getItem(ADMIN_SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession) as Partial<AdminSession>;

    if (!session.token || !session.expiresAt || !session.username) {
      return null;
    }

    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      clearAdminSession();
      return null;
    }

    return {
      token: session.token,
      expiresAt: session.expiresAt,
      username: session.username,
    };
  } catch {
    clearAdminSession();
    return null;
  }
}

function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

function isRememberedAdminSession(): boolean {
  return Boolean(localStorage.getItem(ADMIN_SESSION_KEY));
}

function saveAdminSession(session: AdminSession, remember: boolean): void {
  const payload = JSON.stringify(session);

  clearAdminSession();

  if (remember) {
    localStorage.setItem(ADMIN_SESSION_KEY, payload);
    return;
  }

  sessionStorage.setItem(ADMIN_SESSION_KEY, payload);
}

async function adminFetch<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  const data = (await res.json().catch(() => null)) as T | ApiErrorBody | null;

  if (!res.ok) {
    const error =
      data && typeof data === "object" && "error" in data
        ? data.error
        : "Unable to load admin data.";
    throw new Error(error);
  }

  return data as T;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function csvEscape(value: string | boolean): string {
  const raw = String(value);
  return `"${raw.replace(/"/g, '""')}"`;
}

function exportCsv(leads: Lead[]): void {
  const header = ["Name", "Email", "Mobile", "City", "Status", "Contacted", "Message", "Notes", "Registered"];
  const rows = leads.map((lead) => [
    lead.fullName,
    lead.email,
    lead.mobile,
    lead.city,
    lead.status,
    lead.contacted,
    lead.message,
    lead.notes,
    formatDate(lead.createdAt),
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `naivaidya-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5 text-purple-300">
        <Users className="h-10 w-10" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No waitlist users yet</h3>
      <p className="text-gray-500 text-sm max-w-xs">New registrations from the website will appear here.</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [adminAccounts, setAdminAccounts] = useState<AdminAccountSummary[]>([]);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [credentialForm, setCredentialForm] = useState<CredentialForm>({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [newAdminForm, setNewAdminForm] = useState<NewAdminForm>({
    username: "",
    password: "",
    confirmPassword: "",
    currentPassword: "",
  });
  const [credentialSaving, setCredentialSaving] = useState(false);
  const [credentialError, setCredentialError] = useState("");
  const [credentialMessage, setCredentialMessage] = useState("");
  const [adminAccountSaving, setAdminAccountSaving] = useState(false);
  const [adminAccountError, setAdminAccountError] = useState("");
  const [adminAccountMessage, setAdminAccountMessage] = useState("");
  const [deletingAdminIds, setDeletingAdminIds] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "All">("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});

  const loadDashboard = useCallback(async (token: string) => {
    setError("");
    const [summaryData, usersData, profileData, adminsData] = await Promise.all([
      adminFetch<Summary>("/api/admin/summary", token),
      adminFetch<UsersResponse>("/api/admin/waitlist-users", token),
      adminFetch<ProfileResponse>("/api/admin/profile", token),
      adminFetch<AdminAccountsResponse>("/api/admin/admins", token),
    ]);
    setSummary(summaryData);
    setLeads(usersData.users);
    setAdminAccounts(adminsData.admins);
    setNoteDrafts(Object.fromEntries(usersData.users.map((lead) => [lead.id, lead.notes])));
    setSession((current) => current ? { ...current, username: profileData.admin.username } : current);
    setCredentialForm((current) => ({ ...current, username: profileData.admin.username }));
  }, []);

  useEffect(() => {
    const storedSession = readAdminSession();

    if (!storedSession) {
      setLocation("/admin");
      return;
    }

    setSession(storedSession);
    setCredentialForm((current) => ({ ...current, username: storedSession.username }));
    void loadDashboard(storedSession.token)
      .catch((err) => {
        if (err instanceof Error && err.message.includes("Admin login required")) {
          clearAdminSession();
          setLocation("/admin");
          return;
        }

        setError(err instanceof Error ? err.message : "Unable to load admin dashboard.");
      })
      .finally(() => setLoading(false));
  }, [loadDashboard, setLocation]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesStatus = filterStatus === "All" || lead.status === filterStatus;
      const matchesSearch =
        query.length === 0 ||
        lead.fullName.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.mobile.includes(query) ||
        lead.city.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [leads, search, filterStatus]);

  const counts = useMemo(() => {
    const result: Record<Status | "All", number> = {
      All: leads.length,
      Pending: 0,
      Contacted: 0,
      Interested: 0,
      "Follow Up Required": 0,
      "Not Interested": 0,
    };

    for (const lead of leads) {
      result[lead.status] += 1;
    }

    return result;
  }, [leads]);

  const patchLead = async (id: string, body: Partial<Pick<Lead, "status" | "contacted" | "notes">>) => {
    if (!session) {
      return;
    }

    setSavingIds((current) => ({ ...current, [id]: true }));
    setError("");

    try {
      const data = await adminFetch<UpdateLeadResponse>(`/api/admin/waitlist-users/${id}`, session.token, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      setLeads((current) => current.map((lead) => (lead.id === id ? data.user : lead)));
      setNoteDrafts((current) => ({ ...current, [id]: data.user.notes }));
      const summaryData = await adminFetch<Summary>("/api/admin/summary", session.token);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update lead.");
    } finally {
      setSavingIds((current) => ({ ...current, [id]: false }));
    }
  };

  const updateStatus = (id: string, status: Status) => {
    void patchLead(id, { status });
  };

  const toggleContacted = (lead: Lead) => {
    const contacted = !lead.contacted;
    const status = contacted && lead.status === "Pending" ? "Contacted" : lead.status;
    void patchLead(lead.id, { contacted, status });
  };

  const saveNote = (lead: Lead) => {
    const nextNote = noteDrafts[lead.id] ?? "";

    if (nextNote !== lead.notes) {
      void patchLead(lead.id, { notes: nextNote });
    }
  };

  const updateCredentialField = <K extends keyof CredentialForm>(key: K, value: CredentialForm[K]) => {
    setCredentialForm((current) => ({ ...current, [key]: value }));
    setCredentialError("");
    setCredentialMessage("");
  };

  const updateNewAdminField = <K extends keyof NewAdminForm>(key: K, value: NewAdminForm[K]) => {
    setNewAdminForm((current) => ({ ...current, [key]: value }));
    setAdminAccountError("");
    setAdminAccountMessage("");
  };

  const saveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      return;
    }

    const username = credentialForm.username.trim();
    const wantsPasswordChange = credentialForm.newPassword.length > 0 || credentialForm.confirmPassword.length > 0;

    setCredentialError("");
    setCredentialMessage("");

    if (username.length < 3) {
      setCredentialError("Username must be at least 3 characters.");
      return;
    }

    if (!credentialForm.currentPassword) {
      setCredentialError("Current password is required.");
      return;
    }

    if (wantsPasswordChange && credentialForm.newPassword.length < 8) {
      setCredentialError("New password must be at least 8 characters.");
      return;
    }

    if (credentialForm.newPassword !== credentialForm.confirmPassword) {
      setCredentialError("New password and confirmation do not match.");
      return;
    }

    if (username === session.username && !wantsPasswordChange) {
      setCredentialMessage("No credential changes to save.");
      setCredentialForm((current) => ({ ...current, currentPassword: "" }));
      return;
    }

    setCredentialSaving(true);

    try {
      const remember = isRememberedAdminSession();
      const data = await adminFetch<UpdateCredentialsResponse>("/api/admin/credentials", session.token, {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: credentialForm.currentPassword,
          username,
          newPassword: wantsPasswordChange ? credentialForm.newPassword : undefined,
          remember,
        }),
      });
      const nextSession: AdminSession = {
        token: data.token,
        expiresAt: data.expiresAt,
        username: data.admin.username,
      };

      saveAdminSession(nextSession, remember);
      setSession(nextSession);
      setCredentialForm({
        username: data.admin.username,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setCredentialMessage(data.message);
      await loadDashboard(nextSession.token);
    } catch (err) {
      setCredentialError(err instanceof Error ? err.message : "Unable to update admin credentials.");
    } finally {
      setCredentialSaving(false);
    }
  };

  const createAdminAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      return;
    }

    const username = newAdminForm.username.trim();
    setAdminAccountError("");
    setAdminAccountMessage("");

    if (username.length < 3) {
      setAdminAccountError("New admin username must be at least 3 characters.");
      return;
    }

    if (newAdminForm.password.length < 8) {
      setAdminAccountError("New admin password must be at least 8 characters.");
      return;
    }

    if (newAdminForm.password !== newAdminForm.confirmPassword) {
      setAdminAccountError("New admin password and confirmation do not match.");
      return;
    }

    if (!newAdminForm.currentPassword) {
      setAdminAccountError("Your current password is required to add an admin.");
      return;
    }

    setAdminAccountSaving(true);

    try {
      const data = await adminFetch<CreateAdminResponse>("/api/admin/admins", session.token, {
        method: "POST",
        body: JSON.stringify({
          username,
          password: newAdminForm.password,
          currentPassword: newAdminForm.currentPassword,
        }),
      });
      setAdminAccounts((current) => [data.admin, ...current]);
      setNewAdminForm({
        username: "",
        password: "",
        confirmPassword: "",
        currentPassword: "",
      });
      setAdminAccountMessage(data.message);
    } catch (err) {
      setAdminAccountError(err instanceof Error ? err.message : "Unable to add admin.");
    } finally {
      setAdminAccountSaving(false);
    }
  };

  const removeAdminAccount = async (admin: AdminAccountSummary) => {
    if (!session || admin.isCurrent) {
      return;
    }

    const currentPassword = window.prompt(`Enter your current password to remove ${admin.username}`);

    if (!currentPassword) {
      return;
    }

    setDeletingAdminIds((current) => ({ ...current, [admin.id]: true }));
    setAdminAccountError("");
    setAdminAccountMessage("");

    try {
      const data = await adminFetch<DeleteAdminResponse>(`/api/admin/admins/${admin.id}`, session.token, {
        method: "DELETE",
        body: JSON.stringify({ currentPassword }),
      });
      setAdminAccounts((current) => current.filter((item) => item.id !== data.deletedId));
      setAdminAccountMessage(data.message);
    } catch (err) {
      setAdminAccountError(err instanceof Error ? err.message : "Unable to remove admin.");
    } finally {
      setDeletingAdminIds((current) => ({ ...current, [admin.id]: false }));
    }
  };

  const refresh = async () => {
    if (!session) {
      return;
    }

    setLoading(true);
    await loadDashboard(session.token)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to refresh admin dashboard."))
      .finally(() => setLoading(false));
  };

  const logout = () => {
    clearAdminSession();
    setLocation("/admin");
  };

  if (loading && leads.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F5F0FF 0%, #F8F6FF 100%)" }}>
        <div className="flex items-center gap-3 text-[#7C3AED] font-semibold">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #F5F0FF 0%, #F8F6FF 100%)" }}>
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/")}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#7C3AED] transition-colors mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Website
            </button>
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_14px_rgba(124,58,237,0.22)] flex-shrink-0">
              <img src={naivaidyaLogo} alt="NAIVAIDYA" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
              <p className="text-gray-600 text-lg">Total Registered Users: <b className="text-purple-600">{users.length}</b></p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAccountSettings((value) => !value)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#7C3AED] transition-colors border border-gray-200 hover:border-purple-200 px-3 py-1.5 rounded-lg bg-white"
            >
              <Settings className="h-3.5 w-3.5" />
              Account
            </button>
            <button
              onClick={() => void refresh()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#7C3AED] transition-colors border border-gray-200 hover:border-purple-200 px-3 py-1.5 rounded-lg bg-white"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg bg-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Waitlist</h1>
            <p className="text-gray-500 text-sm mt-1">Signed in as {session?.username ?? "admin"}</p>
          </div>
          <button
            onClick={() => exportCsv(filtered)}
            disabled={filtered.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-purple-100 px-4 py-2.5 text-sm font-semibold text-[#7C3AED] shadow-sm hover:border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {showAccountSettings && (
          <div className="mb-8 bg-white rounded-2xl border border-purple-100/60 shadow-[0_4px_24px_rgba(124,58,237,0.07)] overflow-hidden">
            <div className="px-5 py-4 border-b border-purple-50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#7C3AED]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Admin Access</h2>
                  <p className="text-xs text-gray-400">Username and password</p>
                </div>
              </div>
              <button
                onClick={() => setShowAccountSettings(false)}
                className="text-xs font-semibold text-gray-400 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <form onSubmit={saveCredentials} className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Username</label>
                <input
                  value={credentialForm.username}
                  onChange={(e) => updateCredentialField("username", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Current Password</label>
                <div className="relative">
                  <KeyRound className="h-4 w-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={credentialForm.currentPassword}
                    onChange={(e) => updateCredentialField("currentPassword", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm text-gray-900 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={credentialForm.newPassword}
                  onChange={(e) => updateCredentialField("newPassword", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={credentialForm.confirmPassword}
                  onChange={(e) => updateCredentialField("confirmPassword", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                  autoComplete="new-password"
                />
              </div>

              <div className="md:col-span-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="min-h-5">
                  {credentialError && <p className="text-sm font-medium text-red-600">{credentialError}</p>}
                  {credentialMessage && <p className="text-sm font-medium text-green-600">{credentialMessage}</p>}
                </div>
                <button
                  type="submit"
                  disabled={credentialSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #5B21B6, #7C3AED)" }}
                >
                  {credentialSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Credentials
                </button>
              </div>
            </form>

            <div className="border-t border-purple-50 p-5">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/2">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-4 w-4 text-[#7C3AED]" />
                    <h3 className="text-sm font-bold text-gray-900">Admins</h3>
                    <span className="text-xs text-gray-400">({adminAccounts.length})</span>
                  </div>
                  <div className="space-y-2">
                    {adminAccounts.map((admin) => (
                      <div key={admin.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-4 py-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-bold text-gray-900">{admin.username}</p>
                            {admin.isCurrent && (
                              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">Updated {formatDate(admin.updatedAt)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void removeAdminAccount(admin)}
                          disabled={admin.isCurrent || deletingAdminIds[admin.id]}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-red-200 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {deletingAdminIds[admin.id] ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={createAdminAccount} className="lg:w-1/2">
                  <div className="flex items-center gap-2 mb-4">
                    <UserPlus className="h-4 w-4 text-[#7C3AED]" />
                    <h3 className="text-sm font-bold text-gray-900">Add Admin</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Username</label>
                      <input
                        value={newAdminForm.username}
                        onChange={(e) => updateNewAdminField("username", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Your Password</label>
                      <input
                        type="password"
                        value={newAdminForm.currentPassword}
                        onChange={(e) => updateNewAdminField("currentPassword", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                        autoComplete="current-password"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Password</label>
                      <input
                        type="password"
                        value={newAdminForm.password}
                        onChange={(e) => updateNewAdminField("password", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                        autoComplete="new-password"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Confirm</label>
                      <input
                        type="password"
                        value={newAdminForm.confirmPassword}
                        onChange={(e) => updateNewAdminField("confirmPassword", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="min-h-5">
                      {adminAccountError && <p className="text-sm font-medium text-red-600">{adminAccountError}</p>}
                      {adminAccountMessage && <p className="text-sm font-medium text-green-600">{adminAccountMessage}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={adminAccountSaving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #5B21B6, #7C3AED)" }}
                    >
                      {adminAccountSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                      Add Admin
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            { label: "Total", value: summary?.total ?? counts.All, icon: Users },
            { label: "Verified", value: summary?.verified ?? 0, icon: CheckCircle2 },
            { label: "Contacted", value: summary?.contacted ?? 0, icon: CheckCircle2 },
            { label: "Uncontacted", value: summary?.uncontacted ?? 0, icon: Users },
            { label: "Today", value: summary?.registeredToday ?? 0, icon: Users },
            { label: "Latest", value: summary?.latestRegistrationAt ? formatDate(summary.latestRegistrationAt).split(",")[0] : "-", icon: CheckCircle2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl p-3.5 text-left border border-purple-100/60 bg-white">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xl font-bold text-gray-900">{value}</div>
                <Icon className="h-4 w-4 text-[#7C3AED]" />
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5 truncate leading-tight">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            { label: "All", key: "All" as const },
            ...STATUSES.map((status) => ({ label: status, key: status })),
          ].map(({ label, key }) => (
            <motion.button
              key={key}
              onClick={() => setFilterStatus(key)}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className={`rounded-xl p-3.5 text-left border transition-all ${
                filterStatus === key
                  ? "border-[#7C3AED] bg-purple-50 shadow-[0_4px_16px_rgba(124,58,237,0.12)]"
                  : "border-purple-100/60 bg-white hover:border-purple-200"
              }`}
            >
              <div className={`text-2xl font-bold ${filterStatus === key ? "text-[#7C3AED]" : "text-gray-900"}`}>
                {counts[key] ?? 0}
              </div>

        <div className="bg-white rounded-2xl border border-purple-100/60 shadow-[0_4px_24px_rgba(124,58,237,0.07)] overflow-hidden">
          <div className="p-4 border-b border-purple-50 flex items-center gap-3">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, or city..."
              className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400 bg-transparent min-w-0"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-xs font-medium">
                Clear
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[980px]">
              <thead>
                <tr className="bg-purple-50/50 text-left border-b border-purple-50">
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 w-10">Done</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Name</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Contact</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">City</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Registered</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState />
                    </td>
                  </tr>
                ) : (
                  filtered.map((lead) => (
                    <tr key={lead.id} className="border-b border-purple-50/60 hover:bg-purple-50/30 transition-colors align-top">
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={lead.contacted}
                          onChange={() => toggleContacted(lead)}
                          disabled={savingIds[lead.id]}
                          className="w-4 h-4 accent-[#7C3AED] rounded cursor-pointer disabled:opacity-50"
                          title="Mark as contacted"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-900">{lead.fullName}</div>
                        {lead.message && <div className="text-xs text-gray-400 mt-1 max-w-[220px] line-clamp-2">{lead.message}</div>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-gray-700">{lead.email}</div>
                        <div className="text-gray-400 text-xs mt-1">{lead.mobile}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{lead.city}</td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(lead.createdAt)}</td>
                      <td className="px-5 py-4">
                        <div className="relative inline-flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[lead.status]}`} />
                          <select
                            value={lead.status}
                            onChange={(e) => updateStatus(lead.id, e.target.value as Status)}
                            disabled={savingIds[lead.id]}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer appearance-none disabled:opacity-60 ${STATUS_COLORS[lead.status]}`}
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <textarea
                          value={noteDrafts[lead.id] ?? ""}
                          onChange={(e) => setNoteDrafts((current) => ({ ...current, [lead.id]: e.target.value }))}
                          onBlur={() => saveNote(lead)}
                          rows={2}
                          placeholder="Add notes"
                          className="w-full min-w-[180px] resize-none rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                        />
                        {savingIds[lead.id] && (
                          <div className="flex items-center gap-1.5 text-[11px] text-[#7C3AED] mt-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Saving
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 text-xs text-gray-400 border-t border-purple-50 flex items-center justify-between">
            <span>{filtered.length} of {leads.length} registrations</span>
            {filterStatus !== "All" && (
              <button onClick={() => setFilterStatus("All")} className="text-[#7C3AED] font-semibold hover:underline">
                Clear filter
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
