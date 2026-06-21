import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import naivaidyaLogo from "@assets/naivaidya_logo.jpg";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-login if remembered
  useEffect(() => {
    const isRemembered = localStorage.getItem("rememberMe") === "true";
    const savedUsername = localStorage.getItem("rememberedUsername");

    if (isRemembered && savedUsername) {
      // Auto login
      setUsername(savedUsername);
      setTimeout(() => {
        setLocation("/admin/dashboard");
      }, 500);
    }
  }, [setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim()) { setError("Username is required."); return; }
    if (!password.trim()) { setError("Password is required."); return; }

    setLoading(true);
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        // Save remember me
        if (remember) {
          localStorage.setItem("rememberedUsername", username);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedUsername");
          localStorage.removeItem("rememberMe");
        }
        setLocation("/admin/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #F5F0FF 0%, #EDE9FE 50%, #F8F5FF 100%)" }}>
      {/* Top bar */}
      <div className="px-6 py-4">
        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C3AED] hover:text-[#5B21B6] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Website
        </button>
      </div>

      {/* Center card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          {/* Logo + brand */}
          <div className="text-center mb-8">
            <div className="w-18 h-18 rounded-2xl overflow-hidden mx-auto mb-4 shadow-[0_0_28px_rgba(124,58,237,0.3)]"
              style={{ width: 72, height: 72 }}>
              <img src={naivaidyaLogo} alt="NAIVAIDYA" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-wide">NAIVAIDYA</h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">Admin · Waitlist Portal</p>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(124,58,237,0.1)] border border-purple-100 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Sign in to continue</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-gray-900 text-sm transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-gray-900 text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => {
                      setRemember(e.target.checked);
                      if (!e.target.checked) {
                        localStorage.removeItem("rememberedUsername");
                        localStorage.removeItem("rememberMe");
                      }
                    }}
                    className="w-4 h-4 rounded accent-[#7C3AED]"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60 mt-2"
                style={{ background: "linear-gradient(135deg, #5B21B6, #7C3AED)" }}
              >
                {loading ? "Signing in…" : "Sign In →"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
