import { motion } from "framer-motion";

export default function Features() {
  const features = [
    { title: "AI Symptom Checker", desc: "Advanced NLP understands your symptoms in natural language." },
    { title: "Predictive Analytics", desc: "Foresee potential health risks based on historical data patterns." },
    { title: "Smart Prescription", desc: "AI assistant for doctors to prevent drug interactions and errors." },
    { title: "Automated Follow-ups", desc: "Intelligent monitoring post-consultation to ensure recovery." }
  ];

  return (
    <section id="features" className="py-32 relative bg-background overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Intelligence</h2>
            <h3 className="text-4xl md:text-6xl font-bold leading-tight">
              Powered by <br /><span className="text-gradient">Next-Gen AI.</span>
            </h3>
          </div>
          <p className="text-gray-400 mt-6 md:mt-0 max-w-sm">
            Not just digitization. True intelligence that saves lives by making medical decisions faster and more accurate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="1">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold mb-4 relative z-10">{feature.title}</h4>
              <p className="text-gray-400 relative z-10">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
