import { motion } from "framer-motion";

const features = [
  { icon: "💊", title: "Medication Reminders", desc: "Smart reminders with dose tracking, refill alerts, and missed-dose follow-ups to ensure 100% adherence." },
  { icon: "🤰", title: "Pregnancy Assistant", desc: "Week-by-week pregnancy guidance, fetal development updates, and trimester-specific health monitoring." },
  { icon: "🩺", title: "AI Symptom Checker", desc: "Conversational NLP-powered checker that understands natural language and guides you to the right care path." },
  { icon: "📊", title: "AI Health Insights", desc: "Personalized health reports based on vitals, history, and lifestyle — delivered in plain language." },
  { icon: "🔮", title: "AI Risk Prediction", desc: "Proactive risk scoring for diabetes, hypertension, and cardiac events before they become emergencies." },
  { icon: "🚨", title: "Emergency Detection", desc: "Detects emergency patterns from vitals and symptom input, auto-triggers alerts to family and care providers." },
  { icon: "👨‍👩‍👧", title: "Family Dashboard", desc: "Manage health of entire family — parents, children, elderly — from one unified dashboard." },
  { icon: "🏃", title: "Wellness Tracking", desc: "Step counts, sleep quality, stress levels, and hydration tracking integrated with wearables." },
  { icon: "📷", title: "Prescription Scanner", desc: "Scan handwritten prescriptions with OCR — auto-orders medicines and flags potential drug interactions." },
];

export default function AINurse() {
  return (
    <section id="ai-nurse" className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #F5F0FF 0%, #EDE9FE 50%, #F8F5FF 100%)" }}>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-3">AI Nurse Companion</motion.p>
          <motion.h3 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="text-4xl md:text-5xl font-bold text-gray-900">Your 24/7 <span className="text-gradient">Health Guardian.</span></motion.h3>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }} className="text-gray-500 mt-4">An intelligent AI companion that monitors, reminds, predicts, and responds — so you never face a health moment alone.</motion.p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -5, boxShadow: "0 16px 48px rgba(124,58,237,0.15)" }} className="bg-white rounded-2xl p-6 border border-purple-100 shadow-[0_4px_20px_rgba(124,58,237,0.07)] cursor-default">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h4 className="font-bold text-gray-900 mb-2">{f.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
