import { motion } from "framer-motion";
import showcaseVideo from "@assets/can_u_do_it_now__1781933798403.mp4";

const nodes = [
  { label: "Patients", icon: "👤", angle: 270, color: "#7C3AED" },
  { label: "Doctors", icon: "👨‍⚕️", angle: 342, color: "#9F67F7" },
  { label: "Hospitals", icon: "🏥", angle: 54, color: "#7C3AED" },
  { label: "Pharmacies", icon: "💊", angle: 126, color: "#9F67F7" },
  { label: "Diagnostics", icon: "🔬", angle: 198, color: "#7C3AED" },
];

function EcosystemOrbit() {
  const r = 130;
  return (
    <div className="relative w-[340px] h-[340px] mx-auto">
      {/* Orbit rings */}
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-200" />
      <div className="absolute inset-8 rounded-full border border-purple-100" />

      {/* Centre hub */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-bold text-xs text-center z-10 shadow-[0_8px_32px_rgba(124,58,237,0.5)]"
        style={{ background: "linear-gradient(135deg, #7C3AED, #9F67F7)" }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-lg">✦</span>
        <span>NAIVAIDYA</span>
      </motion.div>

      {/* Orbit nodes */}
      {nodes.map((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const x = 50 + (r / 170) * 50 * Math.cos(rad);
        const y = 50 + (r / 170) * 50 * Math.sin(rad);
        return (
          <motion.div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.15 }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md border border-purple-100 bg-white"
            >
              {node.icon}
            </div>
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{node.label}</span>
          </motion.div>
        );
      })}

      {/* Rotating connector ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[#7C3AED]/20 border-t-[#7C3AED]"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export default function Ecosystem() {
  return (
    <section
      id="ecosystem"
      className="py-32 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #F5F0FF 0%, #EDE9FE 60%, #F8F5FF 100%)" }}
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-4"
          >
            The Platform
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900"
          >
            A connected healthcare{" "}
            <span className="text-gradient">reality.</span>
          </motion.h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Orbit diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <EcosystemOrbit />
          </motion.div>

          {/* Video + list */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[2rem] overflow-hidden border border-purple-200 shadow-[0_16px_64px_rgba(124,58,237,0.18)] aspect-video bg-purple-50"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={showcaseVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-transparent" />
            </motion.div>

            <ul className="space-y-4">
              {[
                "Patients: B2C Subscription & Instant Access",
                "Doctors: B2B SaaS for Practice Management",
                "Hospitals: Intelligent Triage & Resource Allocation",
                "Pharmacies: Automated Prescription Fulfillment",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-4 text-gray-700 font-medium"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] flex-shrink-0" />
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
