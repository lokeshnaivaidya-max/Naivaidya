import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import naivaidyaLogo from "@assets/naivaidya_logo.jpg";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [, setLocation] = useLocation();

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
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? "bg-white/92 backdrop-blur-xl border-b border-purple-100 shadow-[0_4px_24px_rgba(124,58,237,0.08)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("hero")}>
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_16px_rgba(124,58,237,0.3)]">
            <img src={naivaidyaLogo} alt="NAIVAIDYA" className="w-full h-full object-cover" />
          </div>
          <span className={`font-bold text-xl tracking-widest transition-colors duration-300 ${scrolled ? "text-[#7C3AED]" : "text-white"}`}>
            NAIVAIDYA
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {["Problem", "Solution", "Features", "Traction"].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className={`text-sm font-semibold tracking-wide transition-colors duration-300 ${
                scrolled ? "text-gray-600 hover:text-[#7C3AED]" : "text-white/80 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-3">
          <motion.button
            data-testid="nav-waitlist"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollTo("waitlist")}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
              scrolled
                ? "bg-[#7C3AED] text-white shadow-[0_4px_16px_rgba(124,58,237,0.3)]"
                : "bg-white text-[#7C3AED] shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
            }`}
          >
            Join Waitlist
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setLocation("/admin")}
            className={`hidden md:block text-sm font-semibold px-4 py-2 rounded-full border transition-all duration-300 ${
              scrolled
                ? "border-[#7C3AED] text-[#7C3AED] hover:bg-purple-50"
                : "border-white/40 text-white hover:bg-white/10"
            }`}
          >
            Admin Login
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
