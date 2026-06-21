import { motion } from "framer-motion";

const solutions = [
  { num: "01", title: "AI Triage & Symptom Check", desc: "Instant NLP-powered symptom analysis determines urgency and routes patients to the right care provider in seconds." },
  { num: "02", title: "Universal Health Records", desc: "One source of truth for patient history — accessible instantly by authorized medical professionals anywhere, anytime." },
  { num: "03", title: "Instant Doctor Consultations", desc: "Connect with verified doctors via video or schedule same-day in-person visits — zero friction, zero wait time." },
  { num: "04", title: "Medicine Delivery in <10 Min", desc: "Pharmacy network integration delivers prescription and OTC medicines within 10 minutes to your doorstep." },
  { num: "05", title: "AI Nurse Companion", desc: "24/7 personal health assistant for medication reminders, pregnancy tracking, wellness insights, and emergency detection." },
  { num: "06", title: "Smart Prescription & Follow-up", desc: "AI-assisted prescriptions prevent drug interactions and automated follow-ups ensure patients never miss critical care." },
];

export default function Solution() {
  return (
    <section id="solution" className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #F5F0FF 0%, #EDE9FE 50%, #F8F5FF 100%)" }}>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-3">The Solution</motion.p>
          <motion.h3 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">One Unified <span className="text-gradient">Ecosystem.</span></motion.h3>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }} className="text-gray-500 text-lg">NAIVAIDYA is an AI-powered platform connecting patients, doctors, pharmacies, and diagnostics into one seamless experience.</motion.p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} whileHover={{ y: -8, boxShadow: "0 24px 64px rgba(124,58,237,0.18)" }} className="bg-white rounded-2xl p-8 shadow-[0_8px_28px_rgba(124,58,237,0.09)] border border-purple-100 group cursor-default relative overflow-hidden">
              <div className="h-1 w-8 bg-gradient-to-r from-[#7C3AED] to-[#9F67F7] mb-6 rounded-full group-hover:w-full transition-all duration-500" />
              <span className="text-4xl font-bold text-gradient opacity-25 mb-3 block leading-none">{s.num}</span>
              <h4 className="text-lg font-bold mb-3 text-gray-900">{s.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
