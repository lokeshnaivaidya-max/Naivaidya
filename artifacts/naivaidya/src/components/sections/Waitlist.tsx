import { useState, useRef, useEffect, type ClipboardEvent, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Step = 1 | 2 | 3;

type ApiErrorBody = {
  success: false;
  error: string;
};

type SendOtpResponse = {
  success: true;
  message: string;
  expiresInSeconds: number;
};

type VerifyOtpResponse = {
  success: true;
  message: string;
  expiresInSeconds: number;
};

type WaitlistResponse = {
  success: true;
  message: string;
  id: string;
};

type WaitlistForm = {
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  message: string;
  agree: boolean;
};

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const RESEND_COOLDOWN_SECONDS = 60;

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => null)) as T | ApiErrorBody | null;

  if (!res.ok) {
    const error =
      data && typeof data === "object" && "error" in data
        ? data.error
        : "Something went wrong. Please try again.";
    throw new Error(error);
  }

  return data as T;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function Waitlist() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<WaitlistForm>({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    message: "",
    agree: false,
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [expiryCountdown, setExpiryCountdown] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (expiryCountdown > 0) {
      const t = setTimeout(() => setExpiryCountdown((c) => Math.max(0, c - 1)), 1000);
      return () => clearTimeout(t);
    }

    return undefined;
  }, [expiryCountdown]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown((c) => Math.max(0, c - 1)), 1000);
      return () => clearTimeout(t);
    }

    return undefined;
  }, [resendCooldown]);

  const updateField = <K extends keyof WaitlistForm>(key: K, value: WaitlistForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setApiError("");
  };

  const validate1 = () => {
    const e: Record<string, string> = {};
    if (form.fullName.trim().length < 2) e.fullName = "Full name is required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email is required";
    if (form.mobile.replace(/\D/g, "").length < 7) e.mobile = "Valid mobile number is required";
    if (form.city.trim().length < 2) e.city = "City is required";
    if (form.message.length > 1000) e.message = "Message must be under 1000 characters";
    if (!form.agree) e.agree = "Please agree before joining the waitlist";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const sendOtp = async (isResend = false) => {
    if (!validate1()) return;
    setSending(true);
    setApiError("");

    try {
      const data = await apiPost<SendOtpResponse>("/api/send-otp", {
        email: form.email,
        fullName: form.fullName,
        mobile: form.mobile,
        city: form.city,
        message: form.message,
      });
      setOtp(["", "", "", "", "", ""]);
      setStep(2);
      setExpiryCountdown(data.expiresInSeconds);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      window.setTimeout(() => otpRefs.current[0]?.focus(), isResend ? 0 : 250);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Unable to send OTP.");
    } finally {
      setSending(false);
    }
  };

  const resendOtp = async () => {
    if (resendCooldown > 0 || sending) {
      return;
    }

    await sendOtp(true);
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    if (digits.length === 0) {
      return;
    }

    e.preventDefault();
    const next = Array.from({ length: 6 }, (_, i) => digits[i] ?? "");
    setOtp(next);
    setApiError("");
    otpRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const verifyOtp = async () => {
    if (otp.join("").length < 6) return;
    setVerifying(true);
    setApiError("");

    try {
      const verified = await apiPost<VerifyOtpResponse>("/api/verify-otp", {
        email: form.email,
        otp: otp.join(""),
      });
      setExpiryCountdown(verified.expiresInSeconds);

      await apiPost<WaitlistResponse>("/api/waitlist", {
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        city: form.city,
        message: form.message,
      });

      setStep(3);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Invalid OTP.");
    } finally {
      setVerifying(false);
    }
  };

  const sv = {
    hidden: { opacity: 0, x: 24 },
    show: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  };

  return (
    <section id="waitlist" className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(160deg,#F5F0FF 0%,#EDE9FE 50%,#F8F5FF 100%)" }}>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-3">
              Early Access
            </motion.p>
            <motion.h3 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }} className="text-4xl md:text-5xl font-bold text-gray-900">
              Join the <span className="text-gradient">Waitlist.</span>
            </motion.h3>
            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.13 }} className="text-gray-500 mt-3">
              Be among the first to experience NAIVAIDYA when we launch.
            </motion.p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-400 ${step >= s ? "bg-[#7C3AED] w-8" : "bg-purple-200 w-4"}`} />
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(124,58,237,0.12)] border border-purple-100 p-8 overflow-hidden">
            {apiError && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                {apiError}
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" variants={sv} initial="hidden" animate="show" exit="exit" transition={{ duration: 0.25 }} className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-lg mb-5">Your Details</h4>
                  {([
                    { label: "Full Name", key: "fullName", placeholder: "Aryan Sharma", type: "text" },
                    { label: "Email Address", key: "email", placeholder: "you@example.com", type: "email" },
                    { label: "Mobile Number", key: "mobile", placeholder: "+91 98765 43210", type: "tel" },
                    { label: "City", key: "city", placeholder: "Hyderabad", type: "text" },
                  ] as const).map(({ label, key, placeholder, type }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                      <input
                        type={type}
                        value={form[key]}
                        onChange={(e) => updateField(key, e.target.value)}
                        placeholder={placeholder}
                        className={`w-full px-4 py-3 rounded-xl border ${errors[key] ? "border-red-300 bg-red-50" : "border-gray-200"} focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm transition-all`}
                      />
                      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      placeholder="Tell us what you want NAIVAIDYA to help with"
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.message ? "border-red-300 bg-red-50" : "border-gray-200"} focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm transition-all resize-none`}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>
                  <label className="flex items-start gap-3 text-sm text-gray-500">
                    <input
                      type="checkbox"
                      checked={form.agree}
                      onChange={(e) => updateField("agree", e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 accent-[#7C3AED]"
                    />
                    <span>
                      I agree to receive NAIVAIDYA waitlist and launch updates by email.
                      {errors.agree && <span className="block text-red-500 text-xs mt-1">{errors.agree}</span>}
                    </span>
                  </label>
                  <motion.button
                    onClick={() => void sendOtp()}
                    disabled={sending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm mt-2 disabled:opacity-70 transition-all"
                    style={{ background: "linear-gradient(135deg,#5B21B6,#7C3AED)" }}
                  >
                    {sending ? "Sending OTP…" : "Send OTP →"}
                  </motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" variants={sv} initial="hidden" animate="show" exit="exit" transition={{ duration: 0.25 }} className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center mx-auto text-3xl">📧</div>
                    <h4 className="font-bold text-gray-900 text-lg mt-5 mb-1">Enter Verification Code</h4>
                    <p className="text-gray-500 text-sm">6-digit code sent to {form.email}</p>
                    <p className="text-xs text-gray-400 mt-2">Expires in <span className="font-bold text-[#7C3AED]">{formatTime(expiryCountdown)}</span></p>
                  </div>
                  <div className="flex gap-2.5 justify-center">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => { handleOtpChange(i, e.target.value); setApiError(""); }}
                        onKeyDown={(e) => handleOtpKey(i, e)}
                        onPaste={handleOtpPaste}
                        className="w-11 h-12 text-center text-xl font-bold rounded-xl border-2 border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-gray-900 transition-all"
                      />
                    ))}
                  </div>
                  <motion.button
                    onClick={verifyOtp}
                    disabled={verifying || otp.join("").length < 6 || expiryCountdown === 0}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-50 transition-all"
                    style={{ background: "linear-gradient(135deg,#5B21B6,#7C3AED)" }}
                  >
                    {verifying ? "Verifying…" : "Verify OTP ✓"}
                  </motion.button>
                  <div className="text-center">
                    {resendCooldown > 0 ? (
                      <p className="text-gray-400 text-sm">Resend OTP in <span className="font-bold text-[#7C3AED]">{resendCooldown}s</span></p>
                    ) : (
                      <button onClick={resendOtp} disabled={sending} className="text-[#7C3AED] text-sm font-semibold hover:underline disabled:opacity-50">
                        {sending ? "Resending…" : "Resend OTP"}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s4" variants={sv} initial="hidden" animate="show" exit="exit" transition={{ duration: 0.25 }} className="text-center py-4 space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto text-4xl"
                  >
                    ✅
                  </motion.div>
                  <h4 className="font-bold text-gray-900 text-2xl">You're on the list!</h4>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto">
                    Welcome, <span className="font-semibold text-gray-900">{form.fullName}</span>! We'll notify you at{" "}
                    <span className="font-semibold">{form.email}</span> when NAIVAIDYA launches in {form.city}.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Verified & Registered
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
