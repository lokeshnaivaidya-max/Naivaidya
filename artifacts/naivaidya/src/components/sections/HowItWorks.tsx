import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Patient opens app", desc: "Immediate access with zero friction. Name, symptoms — that is all.", icon: "📱" },
  { num: "02", title: "AI triage assesses urgency", desc: "NLP engine categorises severity and charts the fastest care path.", icon: "🧠" },
  { num: "03", title: "Matched to right provider", desc: "Connects with the best-fit doctor or facility based on location and need.", icon: "🎯" },
  { num: "04", title: "Consultation + prescription", desc: "Seamless virtual or in-person care. Prescriptions auto-sent to pharmacy.", icon: "🩺" },
  { num: "05", title: "Follow-up & monitoring", desc: "Continuous AI-driven health tracking until full recovery is confirmed.", icon: "📈" },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 relative bg-white overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-4"
          >
            Process
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900"
          >
            Seamless from{" "}
            <span className="text-gradient">Start to Finish.</span>
          </motion.h3>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#7C3AED] via-purple-300 to-transparent hidden md:block" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="flex flex-col md:flex-row gap-6 items-start"
              >
                {/* Step circle */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white text-sm shrink-0 z-10 shadow-[0_8px_24px_rgba(124,58,237,0.35)] pulse-ring"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #9F67F7)" }}
                >
                  {step.icon}
                </motion.div>

                {/* Card */}
                <motion.div
                  whileHover={{ x: 6, boxShadow: "0 16px 48px rgba(124,58,237,0.15)" }}
                  className="flex-1 bg-white rounded-2xl p-7 border border-purple-100 shadow-[0_4px_20px_rgba(124,58,237,0.07)] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-widest">{step.num}</span>
                    <h4 className="text-xl font-bold text-gray-900">{step.title}</h4>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
