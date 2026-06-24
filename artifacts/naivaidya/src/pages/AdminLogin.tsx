import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import naivaidyaLogo from "@assets/naivaidya_logo.png";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const ADMIN_SESSION_KEY = "naivaidya_admin_session";

type ApiErrorBody = {
  success: false;
  error: string;
};

type AdminLoginResponse = {
  success: true;
  token: string;
  expiresAt: string;
  admin: {
    username: string;
  };
};

async function loginAdmin(username: string, password: string, remember: boolean): Promise<AdminLoginResponse> {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, remember }),
  });
  const data = (await res.json().catch(() => null)) as AdminLoginResponse | ApiErrorBody | null;

  if (!res.ok) {
    const error =
      data && typeof data === "object" && "error" in data
        ? data.error
        : "Unable to sign in. Please try again.";
    throw new Error(error);
  }

  return data as AdminLoginResponse;
}

function saveAdminSession(session: AdminLoginResponse, remember: boolean): void {
  const payload = JSON.stringify({
    token: session.token,
    expiresAt: session.expiresAt,
    username: session.admin.username,
  });

  localStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_KEY);

  if (remember) {
    localStorage.setItem(ADMIN_SESSION_KEY, payload);
    return;
  }

  sessionStorage.setItem(ADMIN_SESSION_KEY, payload);
}

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    setLoading(true);

    try {
      const session = await loginAdmin(username.trim(), password, remember);
      saveAdminSession(session, remember);
      setLocation("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #F5F0FF 0%, #EDE9FE 50%, #F8F5FF 100%)" }}>
      <div className="px-6 py-4">
        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C3AED] hover:text-[#5B21B6] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Website
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div
              className="rounded-2xl overflow-hidden mx-auto mb-4 shadow-[0_0_28px_rgba(124,58,237,0.3)]"
              style={{ width: 72, height: 72 }}
            >
              <img src={naivaidyaLogo} alt="NAIVAIDYA" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">NAIVAIDYA</h1>
            <p className="text-gray-500 mt-1">Admin Portal</p>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(124,58,237,0.1)] border border-purple-100 p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#7C3AED]">
                <LockKeyhole className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Sign in to continue</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((value) => !value)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#7C3AED]"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-700 to-purple-600 text-white font-bold rounded-2xl hover:brightness-105 transition-all disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
