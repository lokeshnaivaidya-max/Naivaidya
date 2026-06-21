import { motion } from "framer-motion";

const metrics = [
  { value: "500+", label: "Verified Doctors", icon: "👨‍⚕️", desc: "Onboarded and credentialed" },
  { value: "15,000+", label: "Medicines", icon: "💊", desc: "In our pharmacy network" },
  { value: "24/7", label: "Availability", icon: "🕐", desc: "Round-the-clock support" },
  { value: "<10 min", label: "Delivery", icon: "🚀", desc: "Medicine doorstep delivery" },
];

export default function Traction() {
  return (
    <section id="traction" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #F5F0FF 0%, #EDE9FE 50%, #F8F5FF 100%)" }}>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-3">Traction</motion.p>
          <motion.h3 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.06, duration: 0.4 }} className="text-4xl md:text-5xl font-bold text-gray-900">Built. Tested. <span className="text-gradient">Ready to Scale.</span></motion.h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(124,58,237,0.18)" }}
              className="bg-white rounded-2xl p-7 text-center border border-purple-100 shadow-[0_4px_20px_rgba(124,58,237,0.09)] cursor-default"
            >
              <div className="text-4xl mb-3">{m.icon}</div>
              <div className="text-3xl font-bold text-gradient mb-1">{m.value}</div>
              <div className="font-semibold text-gray-900 text-sm mb-1">{m.label}</div>
              <div className="text-gray-400 text-xs">{m.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
