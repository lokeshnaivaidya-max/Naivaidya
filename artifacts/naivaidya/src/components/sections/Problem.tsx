import { motion } from "framer-motion";

const problems = [
  { icon: "⏱️", title: "Delayed Emergency Access", desc: "Patients lack timely, affordable, quality care. Every minute lost drastically reduces survival chances.", stat: "72 min", statLabel: "avg emergency delay" },
  { icon: "📂", title: "Fragmented Medical Records", desc: "Scattered history across clinics means doctors never have the full picture when it matters most.", stat: "67%", statLabel: "records never unified" },
  { icon: "💸", title: "Unaffordable Healthcare", desc: "Out-of-pocket costs push 63 million Indians into poverty every year due to healthcare expenses.", stat: "63M", statLabel: "pushed to poverty annually" },
  { icon: "🩺", title: "Doctor Overload", desc: "Physicians drown in paperwork instead of patient care. India has only 1 doctor per 1,457 people.", stat: "1:1457", statLabel: "doctor-to-patient ratio" },
  { icon: "💊", title: "Medication Non-Adherence", desc: "Over 50% of chronic patients stop their medication within 6 months, leading to preventable complications.", stat: "50%+", statLabel: "stop meds within 6 months" },
  { icon: "🚨", title: "No Early Warning System", desc: "Conditions like diabetes and hypertension are detected too late. Prevention is absent from the system.", stat: "70%", statLabel: "cases detected late" },
];

export default function Problem() {
  return (
    <section id="problem" className="py-28 relative overflow-hidden bg-white">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-3">The Crisis</motion.p>
          <motion.h3 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="text-4xl md:text-5xl font-bold text-gray-900">Healthcare is <span className="text-gradient">broken.</span></motion.h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(124,58,237,0.15)" }} className="bg-white rounded-2xl p-7 border border-purple-100 shadow-[0_4px_20px_rgba(124,58,237,0.07)] cursor-default">
              <div className="text-3xl mb-4">{p.icon}</div>
              <div className="mb-3">
                <span className="text-3xl font-bold text-gradient">{p.stat}</span>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{p.statLabel}</p>
              </div>
              <h4 className="text-lg font-bold mb-2 text-gray-900">{p.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
