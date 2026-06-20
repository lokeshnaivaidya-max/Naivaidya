import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const problems = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    title: "Delayed Access",
    desc: "Patients lack timely, affordable, and quality care. Every minute lost in an emergency drastically reduces survival chances.",
    stat: "72min",
    statLabel: "avg emergency delay",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: "Fragmented Records",
    desc: "Scattered medical history across hospitals means doctors never have the full picture when it matters most.",
    stat: "67%",
    statLabel: "records never unified",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Overwhelmed Systems",
    desc: "Doctors are burnt out with administrative tasks instead of focusing on patient care. No intelligent triage exists.",
    stat: "3x",
    statLabel: "admin vs care time",
  },
];

export default function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="problem" ref={ref} className="py-32 relative overflow-hidden bg-white">
      {/* Top wave from hero purple */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12">
          <path d="M0,0 C360,60 1080,0 1440,30 L1440,0 Z" fill="rgba(124,58,237,0.05)" />
        </svg>
      </div>

      {/* Decorative blob */}
      <motion.div
        style={{ y }}
        className="absolute -left-40 top-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style2={{ background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-4"
          >
            The Crisis
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-gray-900"
          >
            Healthcare is{" "}
            <span className="text-gradient">broken.</span>
          </motion.h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              whileHover={{ y: -8, boxShadow: "0 24px 64px rgba(124,58,237,0.18)" }}
              className="card-3d bg-white rounded-3xl p-8 border border-purple-100 shadow-[0_4px_24px_rgba(124,58,237,0.08)] cursor-default"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 border border-purple-100">
                {p.icon}
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gradient">{p.stat}</span>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{p.statLabel}</p>
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900">{p.title}</h4>
              <p className="text-gray-500 leading-relaxed text-sm">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom wave into purple */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="rgba(124,58,237,0.06)" />
        </svg>
      </div>
    </section>
  );
}
