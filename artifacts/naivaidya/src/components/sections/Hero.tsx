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

      {/* ══════════════════════════════════════════════════
          ZONE STRATEGY
          Top 55%  → video safe zone — clear, no website text
          Bottom 45% → website content zone — gradient backing
          ══════════════════════════════════════════════════ */}

      {/* Thin dark strip along the very top edge (navbar readability) */}
      <div
        className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)" }}
      />

      {/* Content zone gradient — bottom 50%, fades into black so website text is always legible */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{
          height: "55%",
          background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 45%, transparent 100%)",
        }}
      />

      {/* ── Website content — anchored firmly to bottom ── */}
      <div
        className="absolute left-0 right-0 z-10 px-6 md:px-12"
        style={{ bottom: "clamp(4.5rem, 7vh, 6.5rem)" }}
      >
        <div className="max-w-xl">

          {/* Kicker badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 border border-white/15"
            style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Next-Gen AI Healthcare
          </motion.div>

          {/* Headline — word-by-word reveal */}
          <h1 className="mb-4" style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            <span className="sr-only">The Last Minute Saviour</span>
            <span aria-hidden="true" className="flex flex-wrap gap-x-[0.25em]">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, delay: 0.5 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white font-bold inline-block"
                  style={{
                    fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
                    textShadow: "0 2px 16px rgba(0,0,0,0.6)",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Sub-line — compact, doesn't compete with video text */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="text-white/65 text-sm md:text-base mb-7 max-w-md leading-relaxed"
          >
            AI-powered healthcare connecting patients, doctors, and hospitals — instantly.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.35 }}
            className="flex flex-wrap gap-3"
          >
            <motion.button
              data-testid="button-join-revolution"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
              className="px-7 py-3 rounded-full font-bold text-white text-sm btn-shimmer relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #5B21B6, #7C3AED)" }}
            >
              Join the Revolution
            </motion.button>
            <motion.button
              data-testid="button-discover"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })}
              className="px-7 py-3 rounded-full font-semibold text-white text-sm border border-white/25"
              style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
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
        transition={{ delay: 2 }}
        className="absolute bottom-7 right-8 z-10 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[9px] text-white/35 uppercase tracking-[0.25em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-6 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>

      {/* ── White wave into sections ── */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="w-full h-10 md:h-14">
          <path d="M0,28 C360,56 1080,0 1440,28 L1440,56 L0,56 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
