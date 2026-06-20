import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import naivaidyaLogo from "@assets/naivaidya_logo.jpg";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("hero")}>
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <img src={naivaidyaLogo} alt="NAIVAIDYA Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-xl tracking-tight tracking-widest text-white">
            NAIVAIDYA
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {["Problem", "Solution", "Features", "Ecosystem"].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className="text-sm text-gray-300 hover:text-white transition-colors tracking-wide font-medium"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center">
          <Button 
            onClick={() => scrollTo("waitlist")}
            className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] rounded-full px-6"
          >
            Join Waitlist
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
