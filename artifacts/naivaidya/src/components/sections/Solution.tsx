import { motion } from "framer-motion";

export default function Solution() {
  return (
    <section id="solution" className="py-32 relative bg-[#0a0a0f] overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold text-primary uppercase tracking-widest mb-4"
          >
            The Solution
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            One Unified <span className="text-gradient">Ecosystem.</span>
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            NAIVAIDYA is an AI-powered platform connecting patients, doctors, hospitals, and pharmacies into a single, seamless experience.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Real-Time AI Triage",
              desc: "Instant symptom analysis to determine urgency and route to the correct care provider automatically.",
              delay: 0.1
            },
            {
              title: "Universal Records",
              desc: "A single source of truth for patient history, accessible instantly by authorized medical professionals.",
              delay: 0.2
            },
            {
              title: "Instant Consultations",
              desc: "Seamlessly connect with top doctors via video or schedule immediate in-person visits.",
              delay: 0.3
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: item.delay, duration: 0.6 }}
              className="glass-card p-8 rounded-3xl group hover:border-primary/50 transition-colors duration-500"
            >
              <div className="h-2 w-12 bg-primary mb-8 rounded-full group-hover:w-full transition-all duration-500" />
              <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
