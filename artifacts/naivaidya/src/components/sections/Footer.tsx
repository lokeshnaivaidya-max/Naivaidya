import { motion } from "framer-motion";
import naivaidyaLogo from "@assets/naivaidya_logo.jpg";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden py-16"
      style={{ background: "linear-gradient(135deg, #3B0FA8 0%, #7C3AED 60%, #9F67F7 100%)" }}
    >
      {/* BG orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 300 + i * 200,
              height: 300 + i * 200,
              left: i === 0 ? "-10%" : "70%",
              top: i === 0 ? "-30%" : "20%",
              background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-12">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-14 h-14 rounded-2xl overflow-hidden shadow-[0_0_24px_rgba(255,255,255,0.3)]"
            >
              <img src={naivaidyaLogo} alt="NAIVAIDYA" className="w-full h-full object-cover" />
            </motion.div>
            <div>
              <h3 className="font-bold text-2xl tracking-widest text-white">NAIVAIDYA</h3>
              <p className="text-white/60 text-sm tracking-widest uppercase">The Last Minute Saviour</p>
            </div>
          </div>

          <div className="flex gap-6 text-sm">
            {["Privacy Policy", "Terms of Service", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/60 hover:text-white transition-colors font-medium"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="text-center text-white/40 text-sm border-t border-white/10 pt-8">
          © {new Date().getFullYear()} NAIVAIDYA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
