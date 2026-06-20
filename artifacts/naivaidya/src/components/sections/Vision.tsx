import { motion } from "framer-motion";

export default function Vision() {
  return (
    <section id="vision" className="py-40 relative bg-background overflow-hidden flex items-center justify-center min-h-[80vh]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10" />
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15)_0,transparent_50%)]" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          <svg className="w-16 h-16 mx-auto mb-8 text-primary opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
            Making quality healthcare accessible to <span className="text-gradient italic font-serif">every Indian</span> in their last minute of need.
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
