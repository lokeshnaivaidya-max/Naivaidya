import { motion } from "framer-motion";
import naivaidyaLogo from "@assets/naivaidya_logo.jpg";

export default function AppDownload() {
  return (
    <section
      id="app-download"
      className="py-32 relative overflow-hidden bg-white"
    >
      {/* Radial purple glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(109,40,217,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-bold text-[#6D28D9] uppercase tracking-widest mb-4"
            >
              Download the App
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight"
            >
              Healthcare in{" "}
              <span className="text-gradient">your pocket.</span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-lg leading-relaxed mb-10"
            >
              The NAIVAIDYA app puts the entire healthcare ecosystem in your hands. AI triage, instant consultations, and unified health records — all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              {/* Google Play */}
              <motion.a
                href="#"
                data-testid="link-google-play"
                whileHover={{ scale: 1.05, boxShadow: "0 16px 48px rgba(109,40,217,0.25)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-purple-200 bg-white shadow-[0_4px_24px_rgba(109,40,217,0.08)] group transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
                  <path d="M3.18 23.76a2 2 0 0 0 2.01-.22l12.67-7.31-2.91-2.91L3.18 23.76z" fill="#EA4335" />
                  <path d="M20.82 9.79 17.76 8l-3.33 3.33 3.33 3.33 3.09-1.78a1.92 1.92 0 0 0 0-3.09z" fill="#FBBC04" />
                  <path d="M3.18.24a1.92 1.92 0 0 0-.68 1.5v20.52a1.92 1.92 0 0 0 .68 1.5l.1.1 11.5-11.5v-.27L3.28.14z" fill="#4285F4" />
                  <path d="m14.78 8-11.6-7.86-.1.1 11.5 11.5.2-.2L17.76 8z" fill="#34A853" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Get it on</p>
                  <p className="text-gray-900 font-bold text-base leading-tight group-hover:text-[#6D28D9] transition-colors">Google Play</p>
                </div>
              </motion.a>

              {/* App Store */}
              <motion.a
                href="#"
                data-testid="link-app-store"
                whileHover={{ scale: 1.05, boxShadow: "0 16px 48px rgba(109,40,217,0.25)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-purple-200 bg-white shadow-[0_4px_24px_rgba(109,40,217,0.08)] group transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="currentColor">
                  <path className="text-gray-800 group-hover:text-[#6D28D9] transition-colors"
                    d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Download on the</p>
                  <p className="text-gray-900 font-bold text-base leading-tight group-hover:text-[#6D28D9] transition-colors">App Store</p>
                </div>
              </motion.a>
            </motion.div>
          </div>

          {/* Right: 3D phone mockup (CSS) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative" style={{ perspective: "1000px" }}>
              {/* Outer glow */}
              <div
                className="absolute inset-0 rounded-[3rem] blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(109,40,217,0.22) 0%, transparent 70%)", transform: "scale(1.2)" }}
              />

              {/* Phone shell */}
              <motion.div
                className="relative w-64 rounded-[3rem] overflow-hidden shadow-[0_48px_100px_rgba(109,40,217,0.3),0_0_0_2px_rgba(109,40,217,0.15)]"
                style={{
                  background: "linear-gradient(160deg, #1a0533 0%, #2d0f6e 50%, #1a0533 100%)",
                  height: "520px",
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  rotateY: [0, 6, 0, -6, 0],
                  rotateX: [0, -3, 0, 3, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />

                {/* Screen content */}
                <div className="absolute inset-2 rounded-[2.5rem] overflow-hidden"
                  style={{ background: "linear-gradient(160deg, #0f0020 0%, #1a0040 100%)" }}>
                  {/* App header */}
                  <div className="px-5 pt-10 pb-4 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg overflow-hidden">
                      <img src={naivaidyaLogo} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-white text-xs font-bold tracking-wider">NAIVAIDYA</span>
                  </div>

                  {/* Hero screen card */}
                  <div className="mx-4 mb-3 p-4 rounded-2xl"
                    style={{ background: "rgba(109,40,217,0.35)", border: "1px solid rgba(109,40,217,0.4)" }}>
                    <p className="text-[9px] text-purple-300 uppercase tracking-widest mb-1">AI Triage</p>
                    <p className="text-white text-xs font-bold leading-tight">Assess my symptoms</p>
                    <div className="mt-2 h-1 w-full bg-purple-900 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-gradient-to-r from-violet-400 to-purple-300 rounded-full"
                        animate={{ width: ["0%", "75%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }} />
                    </div>
                  </div>

                  {/* Feature pills */}
                  <div className="px-4 flex flex-wrap gap-2">
                    {["Doctor", "Pharmacy", "Records", "Emergency"].map((item) => (
                      <div key={item} className="px-3 py-1.5 rounded-full text-[9px] font-bold text-purple-200"
                        style={{ background: "rgba(109,40,217,0.25)", border: "1px solid rgba(109,40,217,0.35)" }}>
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Pulse indicator */}
                  <div className="mx-4 mt-4 p-4 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-purple-300 text-[9px] uppercase tracking-wider mb-2">Health Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-white text-xs font-semibold">All vitals normal</span>
                    </div>
                  </div>
                </div>

                {/* Specular highlight */}
                <div className="absolute inset-0 rounded-[3rem] pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />
              </motion.div>

              {/* Floating badges around phone */}
              {[
                { label: "AI Triage", icon: "🧠", top: "10%", right: "-18%" },
                { label: "Secure", icon: "🔒", top: "55%", right: "-22%" },
                { label: "Instant", icon: "⚡", top: "30%", left: "-20%" },
              ].map((badge) => (
                <motion.div
                  key={badge.label}
                  className="absolute flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg text-xs font-bold text-gray-900 bg-white border border-purple-100"
                  style={{ top: badge.top, right: badge.right, left: badge.left }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3 + Object.values(badge).length, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
