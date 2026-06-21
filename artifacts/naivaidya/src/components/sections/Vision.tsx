import { motion } from "framer-motion";
import naivaidyaLogo from "@assets/naivaidya_logo.jpg";

export default function Vision() {
  return (
    <section
      id="vision"
      className="py-40 relative overflow-hidden flex items-center justify-center min-h-[70vh]"
      style={{ background: "linear-gradient(135deg, #3B0FA8 0%, #7C3AED 50%, #9F67F7 100%)" }}
    >
      {/* Animated BG orbs */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 300 + i * 200,
            height: 300 + i * 200,
            left: `${10 + i * 30}%`,
            top: `${10 + i * 20}%`,
            background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        />
      ))}

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          {/* Healthcare pulse icon — replaces Gemini-like ✦ */}
          <motion.div
            className="mb-8 flex justify-center"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative">
              {/* Pulse rings */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border border-white/30"
                  animate={{ scale: [1, 2 + i * 0.5], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
                />
              ))}
              {/* NAIVAIDYA logo */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden"
                style={{ border: "2px solid rgba(255,255,255,0.5)", boxShadow: "0 0 32px rgba(255,255,255,0.25)" }}>
                <img src={naivaidyaLogo} alt="NAIVAIDYA" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>

          <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-10 leading-tight tracking-tight text-white">
            Making quality healthcare accessible to{" "}
            <span className="text-gradient-white italic">every Indian</span>{" "}
            in their last minute of need.
          </h2>

          <motion.div
            className="w-24 h-1 bg-white/40 mx-auto rounded-full mb-10"
            animate={{ scaleX: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.button
            whileHover={{ scale: 1.06, boxShadow: "0 16px 48px rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
            className="px-10 py-4 bg-white text-[#7C3AED] font-bold rounded-full text-lg shadow-[0_8px_32px_rgba(0,0,0,0.2)] btn-shimmer relative overflow-hidden"
          >
            Be Part of the Future
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom wave into white */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,60 C480,0 960,80 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
