import { motion } from "framer-motion";
import naivaidyaLogo from "@assets/naivaidya_logo.png";
import showcaseVideo from "@assets/can_u_do_it_now__1781933798403.mp4";

const nodes = [
  { label: "Patients", icon: "👤", angle: 270 },
  { label: "Doctors", icon: "👨‍⚕️", angle: 342 },
  { label: "Pharmacies", icon: "💊", angle: 54 },
  { label: "Diagnostics", icon: "🔬", angle: 126 },
  { label: "Care Network", icon: "🏠", angle: 198 },
];

function OrbitDiagram() {
  const r = 130;
  return (
    <div className="relative w-[320px] h-[320px] mx-auto">
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-200" />
      <div className="absolute inset-8 rounded-full border border-purple-100" />

      {/* Center: NAIVAIDYA logo */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full overflow-hidden z-10"
        style={{ border: "3px solid white", boxShadow: "0 8px 28px rgba(124,58,237,0.4)" }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={naivaidyaLogo} alt="NAIVAIDYA" className="w-full h-full object-cover" />
      </motion.div>

      {nodes.map((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const x = 50 + (r / 160) * 50 * Math.cos(rad);
        const y = 50 + (r / 160) * 50 * Math.sin(rad);
        return (
          <motion.div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1" style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 200 }} whileHover={{ scale: 1.15 }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-sm border border-purple-100 bg-white">{node.icon}</div>
            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">{node.label}</span>
          </motion.div>
        );
      })}

      {/* Rotating ring */}
      <motion.div className="absolute inset-0 rounded-full border-2 border-[#7C3AED]/20 border-t-[#7C3AED]"
        animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
    </div>
  );
}

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #F5F0FF 0%, #EDE9FE 60%, #F8F5FF 100%)" }}>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-3">The Platform</motion.p>
          <motion.h3 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="text-4xl md:text-5xl font-bold text-gray-900">A connected healthcare <span className="text-gradient">reality.</span></motion.h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <OrbitDiagram />
          </motion.div>

          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden border border-purple-200 shadow-[0_12px_48px_rgba(124,58,237,0.15)] aspect-video bg-purple-50">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source src={showcaseVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-transparent" />
            </motion.div>

            <ul className="space-y-3">
              {[
                "Patients: B2C Subscription & Instant Access",
                "Doctors: B2B SaaS for Practice Management",
                "Pharmacies: Automated Prescription Fulfillment",
                "Diagnostics: Lab Tests & Home Sample Collection",
                "Care Network: Nurse Home Visits & Teleconsults",
              ].map((item, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08 }} className="flex items-center gap-3 text-gray-700 font-medium text-sm">
                  <div className="w-2 h-2 rounded-full bg-[#7C3AED] flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
