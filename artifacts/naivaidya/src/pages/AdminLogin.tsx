import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
const naivaidyaLogo = "/naivaidya-logo.png";

interface Admin {
  username: string;
  password: string;
}

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto login if remembered
  useEffect(() => {
    const isRemembered = localStorage.getItem("rememberMe") === "true";
    const savedUsername = localStorage.getItem("rememberedUsername");

    if (isRemembered && savedUsername) {
      setUsername(savedUsername);
      setTimeout(() => setLocation("/admin/dashboard"), 800);
    }
  }, [setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Username and Password are required.");
      return;
    }

    setLoading(true);

    const admins: Admin[] = JSON.parse(localStorage.getItem("admins") || "[]");
    const foundAdmin = admins.find(a => a.username === username && a.password === password);

    setTimeout(() => {
      if (foundAdmin || (username === "admin" && password === "admin123")) {
        if (remember) {
          localStorage.setItem("rememberedUsername", username);
          localStorage.setItem("rememberMe", "true");
        }
        setLocation("/admin/dashboard");
      } else {
        setError("Invalid credentials! Please try again.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #F5F0FF 0%, #EDE9FE 50%, #F8F5FF 100%)" }}>
      <div className="px-6 py-4">
        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C3AED] hover:text-[#5B21B6] transition-colors"
        >
          ← Back to Website
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 shadow-xl">
              <img src={naivaidyaLogo} alt="NAIVAIDYA" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">NAIVAIDYA</h1>
            <p className="text-gray-500 mt-1">Admin Portal</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-8">
            <h2 className="text-xl font-bold mb-6 text-center">Sign In</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
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
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-purple-600"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>

              {error && <p className="text-red-600 text-sm text-center">{error}</p>}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-700 to-purple-600 text-white font-bold rounded-2xl hover:brightness-105 transition-all disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign In"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
