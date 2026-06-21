import { motion } from "framer-motion";

const phases = [
  {
    phase: "Phase 1", period: "Q1–Q2 2026", title: "Launch & Validate", color: "#7C3AED",
    items: ["Beta launch in Hyderabad", "1,000 waitlist users converted", "50 doctor consultations/day", "Pharmacy delivery in core zones", "AI symptom checker live", "User feedback loop established"],
  },
  {
    phase: "Phase 2", period: "Q3–Q4 2026", title: "Scale & Expand", color: "#6D28D9",
    items: ["Expand to Mumbai, Delhi, Bangalore, Chennai", "10,000 active users/month", "B2B SaaS for doctor clinics launched", "AI Nurse Companion in production", "Pregnancy care module live", "Series A fundraise"],
  },
  {
    phase: "Phase 3", period: "2027+", title: "Dominate & Diversify", color: "#5B21B6",
    items: ["50+ cities across India", "1M+ registered users", "Insurance integration", "Corporate health partnerships", "Export model to Southeast Asia", "IPO readiness planning"],
  },
];

const expansion = [
  { icon: "🏙️", label: "Tier 1 Cities", desc: "Hyderabad → Mumbai → Delhi → Bangalore → Chennai" },
  { icon: "🏘️", label: "Tier 2–3 Cities", desc: "Pune, Jaipur, Lucknow, Indore, Bhopal, Chandigarh" },
  { icon: "🌏", label: "Southeast Asia", desc: "Bangladesh, Sri Lanka, Nepal — 2027 expansion" },
  { icon: "🤝", label: "B2B Partnerships", desc: "Corporate health, insurance companies, government schemes" },
];

export default function GoToMarket() {
  return (
    <section id="gtm" className="py-28 relative overflow-hidden bg-white">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-3">Go-To-Market</motion.p>
          <motion.h3 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="text-4xl md:text-5xl font-bold text-gray-900">The <span className="text-gradient">Growth Roadmap.</span></motion.h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {phases.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-purple-100 overflow-hidden shadow-[0_4px_20px_rgba(124,58,237,0.09)]">
              <div className="p-5 text-white" style={{ background: `linear-gradient(135deg, ${p.color}, #9F67F7)` }}>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">{p.period}</div>
                <div className="font-bold text-lg">{p.phase}: {p.title}</div>
              </div>
              <div className="bg-white p-5">
                <ul className="space-y-2.5">
                  {p.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] flex-shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mb-10">
          <h4 className="text-2xl font-bold text-gray-900">Expansion Roadmap</h4>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {expansion.map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-6 rounded-2xl border border-purple-100 bg-gradient-to-b from-purple-50 to-white text-center">
              <div className="text-3xl mb-3">{e.icon}</div>
              <div className="font-bold text-gray-900 mb-2">{e.label}</div>
              <div className="text-gray-500 text-sm">{e.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
