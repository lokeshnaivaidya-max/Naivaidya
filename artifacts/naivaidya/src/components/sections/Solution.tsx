import { motion } from "framer-motion";

const solutions = [
  {
    num: "01",
    title: "Real-Time AI Triage",
    desc: "Instant symptom analysis determines urgency and routes patients to the correct care provider automatically — in seconds.",
  },
  {
    num: "02",
    title: "Universal Health Records",
    desc: "A single source of truth for patient history, accessible instantly by authorized medical professionals anywhere.",
  },
  {
    num: "03",
    title: "Instant Consultations",
    desc: "Connect with top doctors via video or schedule immediate in-person visits — zero friction, zero wait.",
  },
];

export default function Solution() {
  return (
    <section
      id="solution"
      className="py-32 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #F5F0FF 0%, #EDE9FE 50%, #F8F5FF 100%)" }}
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-4"
          >
            The Solution
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
          >
            One Unified{" "}
            <span className="text-gradient">Ecosystem.</span>
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg"
          >
            NAIVAIDYA is an AI-powered platform connecting patients, doctors,
            hospitals, and pharmacies into one seamless experience.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              whileHover={{ y: -10, boxShadow: "0 32px 80px rgba(124,58,237,0.22)" }}
              className="bg-white rounded-[2rem] p-10 shadow-[0_8px_32px_rgba(124,58,237,0.1)] border border-purple-100 group cursor-default relative overflow-hidden"
            >
              {/* Animated fill bar */}
              <div className="h-1.5 w-10 bg-gradient-to-r from-[#7C3AED] to-[#9F67F7] mb-8 rounded-full group-hover:w-full transition-all duration-700" />

              <span className="text-5xl font-bold text-gradient opacity-30 mb-4 block leading-none">{s.num}</span>
              <h4 className="text-xl font-bold mb-4 text-gray-900">{s.title}</h4>
              <p className="text-gray-500 leading-relaxed">{s.desc}</p>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle at 80% 20%, rgba(124,58,237,0.06) 0%, transparent 60%)" }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
