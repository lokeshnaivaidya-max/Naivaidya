import { motion } from "framer-motion";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Problem from "@/components/sections/Problem";
import Solution from "@/components/sections/Solution";
import Ecosystem from "@/components/sections/Ecosystem";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import BusinessModel from "@/components/sections/BusinessModel";
import Vision from "@/components/sections/Vision";
import Waitlist from "@/components/sections/Waitlist";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";

export default function Home() {
  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <Problem />
        <Solution />
        <Ecosystem />
        <Features />
        <HowItWorks />
        <BusinessModel />
        <Vision />
        <Waitlist />
        <FAQ />
      </main>
      
      <Footer />
    </div>
  );
}
