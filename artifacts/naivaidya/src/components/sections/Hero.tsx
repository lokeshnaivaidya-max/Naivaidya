import { motion } from "framer-motion";
import heroVideo from "@assets/NAIVAIDYA_IMPORTANT__Display_1781933796036.mp4";

const orbs = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 120 + 40,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 5,
  duration: Math.random() * 10 + 8,
  purple: Math.random() > 0.5,
}));

export default function Hero() {
  const text = "The Last Minute Saviour".split("");

  return (
    <section id="hero" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/65 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      {/* CSS Floating Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {orbs.map((orb) => (
          <motion.div
            key={orb.id}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              background: orb.purple
                ? "radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(124,58,237,0) 70%)"
                : "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)",
              filter: "blur(8px)",
            }}
            animate={{
              y: [0, -30, 0, 20, 0],
              x: [0, 10, -10, 5, 0],
              scale: [1, 1.1, 0.95, 1.05, 1],
              opacity: [0.6, 0.9, 0.7, 1, 0.6],
            }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Purple radial glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md inline-block"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Next-Gen AI Healthcare
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
          <span className="sr-only">The Last Minute Saviour</span>
          <span aria-hidden="true" className="flex justify-center space-x-[0.05em] flex-wrap">
            {text.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.05,
                  ease: [0.2, 0.65, 0.3, 0.9],
                }}
                className={char === " " ? "w-4 md:w-8" : "text-white"}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed"
        >
          Making quality healthcare accessible to every Indian in their last minute of need. An intelligent ecosystem connecting patients, doctors, and hospitals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            data-testid="button-join-revolution"
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] text-lg"
          >
            Join the Revolution
          </button>
          <button
            data-testid="button-discover"
            onClick={() => document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 bg-transparent border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all text-lg backdrop-blur-sm"
          >
            Discover How
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-px h-10 bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </section>
  );
}
