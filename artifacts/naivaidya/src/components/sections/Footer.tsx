import { motion } from "framer-motion";
import naivaidyaLogo from "@assets/naivaidya_logo.jpg";

const faqItems = [
  { q: "What is NAIVAIDYA?", a: "An AI-powered healthcare platform connecting patients, doctors, and pharmacies in India." },
  { q: "When does the app launch?", a: "Beta launches in Hyderabad in Q1 2026. Join the waitlist for early access." },
  { q: "Is it free to use?", a: "Basic features are free. Premium AI Nurse and advanced features require a subscription." },
  { q: "Which cities are covered?", a: "Starting with Hyderabad, expanding to Mumbai, Delhi, Bangalore and Chennai by end of 2026." },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #3B0FA8 0%, #7C3AED 60%, #9F67F7 100%)" }}>
      {/* FAQ + Links row */}
      <div className="container mx-auto px-6 pt-16 pb-10">
        <div className="grid md:grid-cols-2 gap-12 mb-14">
          {/* LEFT: FAQ */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_16px_rgba(255,255,255,0.25)]">
                <img src={naivaidyaLogo} alt="NAIVAIDYA" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-bold text-white tracking-widest">NAIVAIDYA</div>
                <div className="text-white/50 text-xs tracking-widest uppercase">The Last Minute Saviour</div>
              </div>
            </div>
            <h4 className="text-white font-bold text-lg mb-5">Frequently Asked Questions</h4>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="border-b border-white/15 pb-4">
                  <p className="text-white/90 font-semibold text-sm mb-1">{item.q}</p>
                  <p className="text-white/55 text-sm leading-relaxed">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: Contact + Links */}
          <div className="md:pl-8">
            <h4 className="text-white font-bold text-lg mb-5">Get in Touch</h4>
            <div className="space-y-3 mb-8">
              <a href="mailto:hello@naivaidya.com" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                hello@naivaidya.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                +91 98765 43210
              </a>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Hyderabad, Telangana, India
              </div>
            </div>

            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-widest">Legal</h4>
            <div className="flex flex-wrap gap-4">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(link => (
                <a key={link} href="#" className="text-white/55 hover:text-white transition-colors text-sm">{link}</a>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-widest">Follow Us</h4>
              <div className="flex gap-3">
                {[
                  { label: "Twitter", path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                  { label: "LinkedIn", path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" },
                  { label: "Instagram", path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" },
                ].map(({ label, path }) => (
                  <a key={label} href="#" title={label} className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d={path}/></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/15 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} NAIVAIDYA Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="text-white/30 text-xs">Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
