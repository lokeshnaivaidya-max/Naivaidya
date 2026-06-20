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
      {/* ── VIDEO — full opacity ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/*
        ZONE LAYOUT
        ┌────────────────────────────────┐  0%
        │   TOP SAFE ZONE (clear)        │
        │   video content lives here     │
        │                                │  70%
        ├────────────────────────────────┤
        │   WEBSITE CONTENT STRIP        │  70–100%
        │   gradient backdrop + text     │
        └────────────────────────────────┘  100%
      */}

      {/* Navbar darkening only — very top edge */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)" }}
      />

      {/* Bottom content zone — covers bottom 38% so website text NEVER reaches video text area */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{
          height: "42%",
          background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 55%, transparent 100%)",
        }}
      />

      {/* ── Website content — strictly anchored to the bottom strip ── */}
      <div className="absolute left-0 right-0 bottom-0 z-10 px-6 md:px-14 pb-10 md:pb-12">
        <div className="max-w-lg">

          {/* Headline */}
          <h1 className="mb-3" style={{ letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            <span className="sr-only">The Last Minute Saviour</span>
            <span aria-hidden="true" className="flex flex-wrap gap-x-[0.22em]">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.65, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white font-bold inline-block"
                  style={{
                    fontSize: "clamp(1.9rem, 4vw, 3.4rem)",
                    textShadow: "0 2px 12px rgba(0,0,0,0.7)",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Sub-line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.95 }}
            className="text-white/60 text-sm mb-6 max-w-sm leading-relaxed"
          >
            AI-powered healthcare connecting patients, doctors, and hospitals — instantly.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 1.15 }}
            className="flex flex-wrap gap-3"
          >
            <motion.button
              data-testid="button-join-revolution"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-2.5 rounded-full font-bold text-white text-sm btn-shimmer relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #5B21B6, #7C3AED)" }}
            >
              Join the Revolution
            </motion.button>
            <motion.button
              data-testid="button-discover"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-2.5 rounded-full font-semibold text-white text-sm border border-white/25"
              style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
            >
              Discover How
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 right-8 z-10 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[9px] text-white/35 uppercase tracking-[0.25em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-6 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>

      {/* White wave into sections */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="w-full h-10 md:h-14">
          <path d="M0,28 C360,56 1080,0 1440,28 L1440,56 L0,56 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
