import { motion } from "framer-motion";
import showcaseVideo from "@assets/can_u_do_it_now__1781933798403.mp4";

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="py-32 relative bg-[#050508] overflow-hidden">
      <div className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">The Platform</h2>
              <h3 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                A connected healthcare reality.
              </h3>
              <p className="text-gray-400 text-lg">
                For the first time, patients, doctors, hospitals, pharmacies, and diagnostics are speaking the same digital language.
              </p>
            </div>
            
            <ul className="space-y-4">
              {['Patients: B2C Subscription & Instant Access', 'Doctors: B2B SaaS for Practice Management', 'Hospitals: Intelligent Triage & Resource Allocation', 'Pharmacies: Automated Prescription Fulfillment'].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-4 text-gray-300"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(124,58,237,0.2)] aspect-[4/3] bg-black"
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover opacity-80 mix-blend-screen"
            >
              <source src={showcaseVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
