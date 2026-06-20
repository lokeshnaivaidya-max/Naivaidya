import { motion } from "framer-motion";
import heroVideo from "@assets/NAIVAIDYA_IMPORTANT__Display_1781933796036.mp4";

const words = ["The", "Last", "Minute", "Saviour"];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100svh", minHeight: "100vh" }}
    >
      {/* ── HERO VIDEO — full opacity, clearly visible ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* ── Vignette only — edges slightly darkened, centre stays clear ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.28) 100%)",
            "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 40%)",
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%)",
          ].join(", "),
        }}
      />

      {/* ── Main hero content — anchored bottom-left ── */}
      <div
        className="absolute left-0 right-0 z-10 px-6 md:px-12"
        style={{ bottom: "clamp(5rem, 8vh, 7rem)" }}
      >
        <div className="max-w-2xl">
          {/* "Next-Gen AI Healthcare" badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/90"
            style={{
              background: "rgba(109,40,217,0.45)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-pulse" />
            Next-Gen AI Healthcare
          </motion.div>

          {/* Headline — word-by-word blur-to-clear */}
          <h1 className="mb-5 leading-none" style={{ letterSpacing: "-0.02em" }}>
            <span className="sr-only">The Last Minute Saviour</span>
            <span aria-hidden="true" className="flex flex-wrap gap-x-[0.3em]">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.85, delay: 0.55 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white font-bold block"
                  style={{
                    fontSize: "clamp(2.6rem, 6.5vw, 5.5rem)",
                    textShadow: "0 4px 32px rgba(0,0,0,0.55)",
                    display: "inline-block",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Glassmorphism description card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl px-5 py-4 mb-7 max-w-lg"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            <p className="text-white/80 text-sm md:text-base leading-relaxed font-light">
              Making quality healthcare accessible to every Indian in their last minute of need — intelligent AI connecting patients, doctors, and hospitals instantly.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 1.5 }}
            className="flex flex-wrap gap-3"
          >
            <motion.button
              data-testid="button-join-revolution"
              whileHover={{ scale: 1.05, boxShadow: "0 12px 40px rgba(109,40,217,0.6)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
              className="relative overflow-hidden px-8 py-3.5 rounded-full font-bold text-white text-base btn-shimmer"
              style={{ background: "linear-gradient(135deg, #5B21B6, #7C3AED, #8B5CF6)" }}
            >
              Join the Revolution
            </motion.button>
            <motion.button
              data-testid="button-discover"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-3.5 rounded-full font-semibold text-white text-base border border-white/30 transition-all"
              style={{ background: "rgba(255,255,255,0.09)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
            >
              Discover How
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 right-8 z-10 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[9px] text-white/40 uppercase tracking-[0.25em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent"
        />
      </motion.div>

      {/* ── White wave transition ── */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="w-full h-10 md:h-14">
          <path d="M0,28 C360,56 1080,0 1440,28 L1440,56 L0,56 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
