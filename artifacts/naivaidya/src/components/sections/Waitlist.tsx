import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Step = 1 | 2 | 3 | 4;

export default function Waitlist() {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const validate1 = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!phone.trim() || phone.length < 10) e.phone = "Valid phone required";
    if (!email.trim() || !email.includes("@")) e.email = "Valid email required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const sendOtp = () => {
    if (!validate1()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStep(2);
      setCountdown(30);
    }, 1200);
  };

  const resendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setCountdown(30);
    otpRefs.current[0]?.focus();
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const verifyOtp = () => {
    if (otp.join("").length < 6) return;
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setStep(4);
    }, 1400);
  };

  const sv = {
    hidden: { opacity: 0, x: 24 },
    show: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  };

  return (
    <section id="waitlist" className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(160deg,#F5F0FF 0%,#EDE9FE 50%,#F8F5FF 100%)" }}>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-lg mx-auto">
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

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-400 ${step >= s ? "bg-[#7C3AED] w-8" : "bg-purple-200 w-4"}`} />
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(124,58,237,0.12)] border border-purple-100 p-8 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Step 1 */}
              {step === 1 && (
                <motion.div key="s1" variants={sv} initial="hidden" animate="show" exit="exit" transition={{ duration: 0.25 }} className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-lg mb-5">Your Details</h4>
                  {([
                    { label: "Full Name", val: name, set: setName, key: "name", placeholder: "Aryan Sharma", type: "text" },
                    { label: "Phone Number", val: phone, set: setPhone, key: "phone", placeholder: "+91 98765 43210", type: "tel" },
                    { label: "Email Address", val: email, set: setEmail, key: "email", placeholder: "you@example.com", type: "email" },
                  ] as const).map(({ label, val, set, key, placeholder, type }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                      <input
                        type={type}
                        value={val}
                        onChange={(e) => { set(e.target.value); setErrors((p) => ({ ...p, [key]: "" })); }}
                        placeholder={placeholder}
                        className={`w-full px-4 py-3 rounded-xl border ${errors[key] ? "border-red-300 bg-red-50" : "border-gray-200"} focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-sm transition-all`}
                      />
                      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                    </div>
                  ))}
                  <motion.button
                    onClick={sendOtp}
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

              {/* Step 2: OTP sent */}
              {step === 2 && (
                <motion.div key="s2" variants={sv} initial="hidden" animate="show" exit="exit" transition={{ duration: 0.25 }} className="text-center space-y-5 py-2">
                  <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center mx-auto text-3xl">📱</div>
                  <h4 className="font-bold text-gray-900 text-lg">OTP Sent!</h4>
                  <p className="text-gray-500 text-sm">We've sent a 6-digit code to<br /><span className="font-semibold text-gray-900">{phone}</span></p>
                  <motion.button
                    onClick={() => setStep(3)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm"
                    style={{ background: "linear-gradient(135deg,#5B21B6,#7C3AED)" }}
                  >
                    Enter OTP →
                  </motion.button>
                </motion.div>
              )}

              {/* Step 3: Enter OTP */}
              {step === 3 && (
                <motion.div key="s3" variants={sv} initial="hidden" animate="show" exit="exit" transition={{ duration: 0.25 }} className="space-y-6">
                  <div className="text-center">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Enter Verification Code</h4>
                    <p className="text-gray-500 text-sm">6-digit code sent to {phone}</p>
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
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKey(i, e)}
                        className="w-11 h-12 text-center text-xl font-bold rounded-xl border-2 border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 outline-none text-gray-900 transition-all"
                      />
                    ))}
                  </div>
                  <motion.button
                    onClick={verifyOtp}
                    disabled={verifying || otp.join("").length < 6}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-50 transition-all"
                    style={{ background: "linear-gradient(135deg,#5B21B6,#7C3AED)" }}
                  >
                    {verifying ? "Verifying…" : "Verify OTP ✓"}
                  </motion.button>
                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-gray-400 text-sm">Resend OTP in <span className="font-bold text-[#7C3AED]">{countdown}s</span></p>
                    ) : (
                      <button onClick={resendOtp} className="text-[#7C3AED] text-sm font-semibold hover:underline">Resend OTP</button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
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
                    Welcome, <span className="font-semibold text-gray-900">{name}</span>! We'll notify you at{" "}
                    <span className="font-semibold">{email}</span> when NAIVAIDYA launches in your city.
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
