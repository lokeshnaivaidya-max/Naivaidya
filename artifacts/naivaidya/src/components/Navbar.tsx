import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import naivaidyaLogo from "@assets/naivaidya_logo.jpg";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-purple-100 shadow-[0_4px_24px_rgba(124,58,237,0.1)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => scrollTo("hero")}
        >
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(124,58,237,0.35)]"
          >
            <img src={naivaidyaLogo} alt="NAIVAIDYA" className="w-full h-full object-cover" />
          </motion.div>
          <span
            className={`font-bold text-xl tracking-widest transition-colors duration-300 ${
              scrolled ? "text-[#7C3AED]" : "text-white"
            }`}
          >
            NAIVAIDYA
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {["Problem", "Solution", "Features", "Ecosystem"].map((item) => (
            <motion.button
              key={item}
              data-testid={`nav-${item.toLowerCase()}`}
              whileHover={{ y: -1 }}
              onClick={() => scrollTo(item.toLowerCase())}
              className={`text-sm font-semibold tracking-wide transition-colors duration-300 ${
                scrolled
                  ? "text-gray-600 hover:text-[#7C3AED]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {item}
            </motion.button>
          ))}
        </nav>

        <motion.button
          data-testid="nav-waitlist"
          whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(124,58,237,0.45)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => scrollTo("waitlist")}
          className={`relative overflow-hidden px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 btn-shimmer ${
            scrolled
              ? "bg-[#7C3AED] text-white shadow-[0_4px_20px_rgba(124,58,237,0.35)]"
              : "bg-white text-[#7C3AED] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          }`}
        >
          Join Waitlist
        </motion.button>
      </div>
    </motion.header>
  );
}
