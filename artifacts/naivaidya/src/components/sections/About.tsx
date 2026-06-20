import { motion } from "framer-motion";

const floatingShapes = [
  { id: 0, size: 120, right: "5%", top: "10%", delay: 0, border: true },
  { id: 1, size: 80, right: "20%", top: "40%", delay: 1.5, border: false },
  { id: 2, size: 200, right: "2%", top: "55%", delay: 0.7, border: true },
  { id: 3, size: 60, right: "30%", top: "75%", delay: 2.2, border: false },
  { id: 4, size: 140, right: "15%", top: "20%", delay: 1.0, border: false },
];

export default function About() {
  return (
    <section id="about" className="py-32 relative bg-[#0a0a0f] overflow-hidden">
      {/* CSS Floating geometric shapes */}
      <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none">
        {floatingShapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute rounded-[30%] rotate-12"
            style={{
              width: shape.size,
              height: shape.size,
              right: shape.right,
              top: shape.top,
              background: shape.border
                ? "transparent"
                : "radial-gradient(circle at 30% 30%, rgba(124,58,237,0.25), rgba(124,58,237,0.05))",
              border: shape.border ? "1px solid rgba(124,58,237,0.3)" : "none",
              backdropFilter: shape.border ? "blur(4px)" : "none",
            }}
            animate={{
              y: [0, -20, 0, 15, 0],
              rotate: [12, 20, 8, 15, 12],
              scale: [1, 1.05, 0.97, 1.03, 1],
            }}
            transition={{
              duration: 8 + shape.id * 1.5,
              delay: shape.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        {/* Glow blob */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)", filter: "blur(30px)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold text-primary uppercase tracking-widest mb-4"
          >
            Who We Are
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
          >
            Not a hospital. <br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
              A breakthrough.
            </span>
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6 text-gray-300 text-lg leading-relaxed"
          >
            <p>
              NAIVAIDYA was born out of a critical realization: healthcare is not suffering from a lack of capable doctors, but from an outdated infrastructure that keeps them disconnected.
            </p>
            <p>
              We are a premium healthcare technology company building the intelligent connective tissue between patients in distress and the care they need. We operate at the intersection of advanced artificial intelligence and human empathy.
            </p>
            <p className="font-semibold text-white pt-4 border-t border-white/10">
              When every second counts, we are The Last Minute Saviour.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
