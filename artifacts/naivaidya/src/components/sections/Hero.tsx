import { motion } from "framer-motion";
import heroVideo from "@assets/NAIVAIDYA_IMPORTANT__Display_1781933796036.mp4";

const words = ["The", "Last", "Minute", "Saviour"];

const floatingOrbs = [
  { id: 0, size: 300, x: "5%", y: "10%", delay: 0, opacity: 0.15 },
  { id: 1, size: 200, x: "75%", y: "5%", delay: 1, opacity: 0.12 },
  { id: 2, size: 150, x: "85%", y: "60%", delay: 0.5, opacity: 0.18 },
  { id: 3, size: 250, x: "10%", y: "65%", delay: 1.5, opacity: 0.1 },
  { id: 4, size: 100, x: "50%", y: "80%", delay: 2, opacity: 0.2 },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #3B0FA8 0%, #7C3AED 40%, #9F67F7 70%, #C4A3FF 100%)" }}
    >
      {/* Video — heavily masked, purely atmospheric */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-[0.07] scale-110"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Solid colour block to guarantee no video text bleeds through */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3B0FA8]/60 via-[#7C3AED]/50 to-[#5B21B6]/70" />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {floatingOrbs.map((orb) => (
          <motion.div
            key={orb.id}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.x,
              top: orb.y,
              background: `radial-gradient(circle, rgba(255,255,255,${orb.opacity}) 0%, transparent 70%)`,
              filter: "blur(2px)",
            }}
            animate={{
              y: [0, -40, 0, 25, 0],
              scale: [1, 1.15, 0.95, 1.08, 1],
            }}
            transition={{
              duration: 10 + orb.id * 2,
              delay: orb.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Decorative floating capsules */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/20"
            style={{
              width: 8 + i * 4,
              height: 8 + i * 4,
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 4 + i,
              delay: i * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 px-5 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md inline-block"
        >
          <span className="text-sm font-semibold text-white uppercase tracking-[0.2em]">
            Next-Gen AI Healthcare
          </span>
        </motion.div>

        <h1 className="mb-6 tracking-tight leading-none">
          <span className="sr-only">The Last Minute Saviour</span>
          <span
            aria-hidden="true"
            className="flex justify-center gap-x-5 flex-wrap text-5xl md:text-7xl lg:text-[6.5rem] font-bold"
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.9,
                  delay: 0.4 + i * 0.18,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-white inline-block"
                style={{ textShadow: "0 4px 32px rgba(0,0,0,0.3)" }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          Making quality healthcare accessible to every Indian in their last minute of need. An intelligent ecosystem connecting patients, doctors, and hospitals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            data-testid="button-join-revolution"
            whileHover={{ scale: 1.05, boxShadow: "0 16px 48px rgba(255,255,255,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
            className="relative overflow-hidden px-10 py-4 bg-white text-[#7C3AED] font-bold rounded-full text-lg shadow-[0_8px_32px_rgba(0,0,0,0.2)] btn-shimmer"
          >
            Join the Revolution
          </motion.button>
          <motion.button
            data-testid="button-discover"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })}
            className="px-10 py-4 bg-white/10 border-2 border-white/40 text-white font-semibold rounded-full backdrop-blur-sm text-lg transition-colors"
          >
            Discover How
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/50 uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent"
        />
      </motion.div>

      {/* Bottom wave into white */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 md:h-20">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
