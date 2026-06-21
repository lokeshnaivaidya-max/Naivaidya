import { motion } from "framer-motion";
const naivaidyaLogo = "/naivaidya-logo.png";

const floatingCards = [
  { id: 0, label: "AI Triage", icon: "🧠", x: "60%", y: "8%", delay: 0 },
  { id: 1, label: "Real-Time", icon: "⚡", x: "80%", y: "38%", delay: 0.7 },
  { id: 2, label: "Secure", icon: "🔒", x: "55%", y: "65%", delay: 1.4 },
];

export default function About() {
  return (
    <section id="about" className="py-32 relative bg-white overflow-hidden">
      {/* Subtle purple radial in bg */}
      <div
        className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)" }}
      />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-4"
            >
              Who We Are
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-gray-900"
            >
              Not a hospital.{" "}
              <span className="text-gradient">A breakthrough.</span>
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-5 text-gray-600 text-lg leading-relaxed"
            >
              <p>
                NAIVAIDYA was born out of a critical realization: healthcare is not
                suffering from a lack of capable doctors, but from an outdated
                infrastructure that keeps them disconnected.
              </p>
              <p>
                We are a premium healthcare technology company building the
                intelligent connective tissue between patients in distress and the
                care they need — at the intersection of advanced AI and human
                empathy.
              </p>
              <p className="font-bold text-gray-900 pt-4 border-t border-purple-100">
                When every second counts, we are The Last Minute Saviour.
              </p>
            </motion.div>
          </div>

          {/* Right: 3D-style floating cards */}
          <div className="relative h-[420px] hidden lg:block">
            {/* Central orb */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.04) 60%, transparent 100%)",
                boxShadow: "0 0 80px rgba(124,58,237,0.2)",
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Orbit ring */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-2 border-dashed border-purple-200"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating mini cards */}
            {floatingCards.map((card) => (
              <motion.div
                key={card.id}
                className="absolute glass-card rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg"
                style={{ left: card.x, top: card.y }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + card.delay * 0.5, duration: 0.35 }}
                animate={{ y: [0, -10, 0] }}
                whileHover={{ scale: 1.08, boxShadow: "0 16px 48px rgba(124,58,237,0.22)" }}
              >
                <span className="text-2xl">{card.icon}</span>
                <span className="font-bold text-gray-900 text-sm">{card.label}</span>
              </motion.div>
            ))}

            {/* Central NAIVAIDYA logo */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full overflow-hidden"
              style={{ boxShadow: "0 8px 32px rgba(124,58,237,0.5)", border: "3px solid white" }}
            >
              <img src={naivaidyaLogo} alt="NAIVAIDYA" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
