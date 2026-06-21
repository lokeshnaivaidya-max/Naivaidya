import { motion } from "framer-motion";

const streams = [
  { title: "B2C Subscription", desc: "Premium patient access plans", icon: "👤", pct: 35 },
  { title: "B2B SaaS", desc: "Enterprise software for hospitals & clinics", icon: "🏥", pct: 40 },
  { title: "Diagnostic Tie-ups", desc: "Revenue share on diagnostic tests", icon: "🔬", pct: 15 },
  { title: "Pharmacy Network", desc: "Fulfillment commissions & integrations", icon: "💊", pct: 10 },
];

export default function BusinessModel() {
  return (
    <section
      id="business-model"
      className="py-32 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #F5F0FF 0%, #EDE9FE 50%, #F8F5FF 100%)" }}
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-4"
          >
            The Economics
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900"
          >
            Sustainable{" "}
            <span className="text-gradient">Growth.</span>
          </motion.h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {streams.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              whileHover={{ y: -10, boxShadow: "0 32px 64px rgba(124,58,237,0.22)" }}
              className="bg-white rounded-[2rem] p-8 border border-purple-100 shadow-[0_4px_24px_rgba(124,58,237,0.09)] text-center group cursor-default"
            >
              <motion.div
                className="text-5xl mb-4 inline-block"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              >
                {s.icon}
              </motion.div>
              <h4 className="text-lg font-bold mb-2 text-gray-900">{s.title}</h4>
              <p className="text-gray-500 text-sm mb-5">{s.desc}</p>

              {/* Revenue bar */}
              <div className="h-1.5 w-full bg-purple-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9F67F7]"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-[#7C3AED] font-bold mt-2">{s.pct}% revenue mix</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
