import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Problem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id="problem" ref={containerRef} className="py-32 relative bg-background overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div style={{ opacity }} className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">The Crisis</h2>
          <h3 className="text-4xl md:text-6xl font-bold mb-12 leading-tight">
            Healthcare is <span className="text-gradient">fragmented.</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div style={{ y: y1 }} className="space-y-8">
              <div className="glass-card p-8 rounded-3xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-4">Delayed Access</h4>
                <p className="text-gray-400 leading-relaxed">
                  Patients lack timely, affordable, and quality care. Every minute lost in an emergency reduces the chances of survival drastically.
                </p>
              </div>

              <div className="glass-card p-8 rounded-3xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
                    <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-4">Fragmented Records</h4>
                <p className="text-gray-400 leading-relaxed">
                  Scattered medical history across different hospitals means doctors never have the full picture when it matters most.
                </p>
              </div>
            </motion.div>

            <motion.div className="space-y-8 md:mt-16">
              <div className="glass-card p-8 rounded-3xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-4">Overwhelmed Systems</h4>
                <p className="text-gray-400 leading-relaxed">
                  Doctors are burnt out with administrative tasks instead of focusing entirely on patient care. The system lacks intelligent triage.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* SVG Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[100px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
        </svg>
      </div>
    </section>
  );
}
