import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    { num: "01", title: "Patient opens app", desc: "Immediate access with zero friction." },
    { num: "02", title: "AI triage assesses urgency", desc: "Instantly categorizes severity." },
    { num: "03", title: "Matched to right care provider", desc: "Connects with best-fit doctor." },
    { num: "04", title: "Consultation + prescription", desc: "Seamless virtual or physical care." },
    { num: "05", title: "Follow-up & monitoring", desc: "Continuous AI-driven health tracking." }
  ];

  return (
    <section id="how-it-works" className="py-32 relative bg-background overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold text-primary uppercase tracking-widest mb-4"
          >
            Process
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Seamless from <span className="text-gradient">Start to Finish.</span>
          </motion.h3>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/20 to-transparent hidden md:block" />
          
          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex flex-col md:flex-row gap-6 md:gap-12 items-start"
              >
                <div className="w-14 h-14 rounded-full bg-black border border-primary flex items-center justify-center font-bold text-xl text-primary shrink-0 relative z-10 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                  {step.num}
                </div>
                <div className="glass-card p-8 rounded-3xl flex-1 hover:-translate-y-1 transition-transform duration-300 border-white/5">
                  <h4 className="text-2xl font-bold mb-2">{step.title}</h4>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
