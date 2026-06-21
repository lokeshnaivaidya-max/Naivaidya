import { motion } from "framer-motion";

const features = [
  { icon: "📅", title: "Weekly Fetal Development", desc: "Detailed week-by-week fetal growth updates with visual guides, milestone alerts, and doctor recommendations." },
  { icon: "🦵", title: "Kick Counter", desc: "Track fetal movement patterns with one tap. Automatically alerts if movement drops below safe thresholds." },
  { icon: "⏱️", title: "Contraction Tracker", desc: "Log contraction time and frequency. Smart analysis determines when to head to the delivery center." },
  { icon: "💊", title: "Supplement Reminders", desc: "Personalized reminders for folic acid, iron, calcium, and trimester-specific vitamins with dosage guidance." },
  { icon: "🥗", title: "Diet Recommendations", desc: "AI-curated weekly meal plans tailored to trimester, deficiencies, cultural food preferences, and cravings." },
  { icon: "🧘", title: "Mental Wellness", desc: "Mood tracking, anxiety assessments, and guided meditations designed specifically for expectant mothers." },
  { icon: "👶", title: "Postnatal Care", desc: "Postpartum recovery tracking, breastfeeding logs, newborn milestone monitoring, and postpartum depression screening." },
  { icon: "🚑", title: "Emergency Maternity Support", desc: "One-tap emergency call with GPS location sharing, auto-alerting nearest maternity facility and family members." },
];

export default function PregnancyCare() {
  return (
    <section id="pregnancy" className="py-28 relative overflow-hidden bg-white">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-3">Pregnancy Care</motion.p>
          <motion.h3 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="text-4xl md:text-5xl font-bold text-gray-900">From Conception to <span className="text-gradient">Cradle.</span></motion.h3>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }} className="text-gray-500 mt-4">Complete pregnancy companion — tracking every milestone, supporting every moment, and safeguarding every emergency.</motion.p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(124,58,237,0.14)" }} className="bg-white rounded-2xl p-6 border border-purple-100 shadow-[0_4px_16px_rgba(124,58,237,0.07)] cursor-default">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm">{f.title}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
