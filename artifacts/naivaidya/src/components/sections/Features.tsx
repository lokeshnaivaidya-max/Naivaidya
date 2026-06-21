import { motion } from "framer-motion";

const features = [
  {
    title: "AI Symptom Checker",
    desc: "Advanced NLP understands your symptoms in natural language and delivers instant, medically-informed guidance.",
    icon: "🩺",
  },
  {
    title: "Predictive Analytics",
    desc: "Foresee potential health risks based on historical data patterns before they become emergencies.",
    icon: "📊",
  },
  {
    title: "Smart Prescription",
    desc: "AI assistant for doctors to prevent drug interactions and reduce prescription errors instantly.",
    icon: "💊",
  },
  {
    title: "Automated Follow-ups",
    desc: "Intelligent monitoring post-consultation ensures continuous care and early warning of complications.",
    icon: "🔔",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-32 relative bg-white overflow-hidden">
      {/* Subtle grid bg */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: "radial-gradient(circle, rgba(124,58,237,0.12) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-4"
            >
              Intelligence
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold leading-tight text-gray-900"
            >
              Powered by{" "}
              <br />
              <span className="text-gradient">Next-Gen AI.</span>
            </motion.h3>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-sm text-lg"
          >
            Not just digitization — true intelligence that saves lives by making medical decisions faster and more accurate.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.93 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              whileHover={{ y: -6, boxShadow: "0 24px 64px rgba(124,58,237,0.18)" }}
              className="p-10 rounded-[2rem] border border-purple-100 bg-white shadow-[0_4px_24px_rgba(124,58,237,0.07)] relative overflow-hidden group cursor-default"
            >
              {/* Icon */}
              <motion.div
                className="text-5xl mb-6 inline-block"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
              >
                {f.icon}
              </motion.div>

              {/* Hover purple fill */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />

              <h4 className="text-2xl font-bold mb-4 text-gray-900 relative z-10">{f.title}</h4>
              <p className="text-gray-500 relative z-10 leading-relaxed">{f.desc}</p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#7C3AED] to-[#9F67F7] w-0 group-hover:w-full transition-all duration-700 rounded-b-[2rem]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
