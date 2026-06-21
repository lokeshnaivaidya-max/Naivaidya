import { motion } from "framer-motion";

const stats = [
  { value: "₹8.6T", label: "India Healthcare Market by 2030", sub: "Growing at 22% CAGR" },
  { value: "1.4B", label: "Total Addressable Population", sub: "Largest in the world" },
  { value: "500M+", label: "Smartphone Users in India", sub: "Digital-first opportunity" },
  { value: "85%", label: "Tier 2–4 Cities Underserved", sub: "Huge white-space market" },
];

const whyNow = [
  { icon: "📱", title: "Mobile-First India", desc: "JIO revolution created 500M+ smartphone users ready for digital health services." },
  { icon: "🏥", title: "Post-COVID Awareness", desc: "COVID accelerated healthcare digitization by 5 years. Patients now expect digital-first care." },
  { icon: "🤖", title: "AI Maturity", desc: "LLMs and diagnostic AI have reached production-ready quality for healthcare applications." },
  { icon: "🏛️", title: "ABDM Infrastructure", desc: "Ayushman Bharat Digital Mission provides the regulatory and infra backbone for health tech." },
  { icon: "💰", title: "Investor Appetite", desc: "Health tech funding in India grew 3x in 2023. Capital is available for the right solution." },
  { icon: "🌐", title: "Network Effects", desc: "Each new doctor, patient, and pharmacy added makes the platform exponentially more valuable." },
];

export default function MarketOpportunity() {
  return (
    <section id="market" className="py-28 relative overflow-hidden bg-white">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-3">Market Opportunity</motion.p>
          <motion.h3 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="text-4xl md:text-5xl font-bold text-gray-900">A <span className="text-gradient">₹8.6 Trillion</span> Opportunity.</motion.h3>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl p-6 text-center border border-purple-100 bg-gradient-to-b from-purple-50 to-white">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{s.value}</div>
              <div className="text-gray-800 font-semibold text-sm mb-1">{s.label}</div>
              <div className="text-gray-400 text-xs">{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Why Now */}
        <div className="text-center mb-12">
          <motion.h4 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold text-gray-900">Why <span className="text-gradient">Now?</span></motion.h4>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {whyNow.map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex gap-4 p-6 rounded-2xl border border-purple-100 bg-white hover:shadow-[0_8px_32px_rgba(124,58,237,0.1)] transition-shadow">
              <span className="text-2xl flex-shrink-0">{w.icon}</span>
              <div>
                <h5 className="font-bold text-gray-900 mb-1">{w.title}</h5>
                <p className="text-gray-500 text-sm leading-relaxed">{w.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
