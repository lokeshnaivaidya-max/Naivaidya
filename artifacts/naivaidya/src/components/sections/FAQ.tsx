import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      q: "Is NAIVAIDYA a hospital?",
      a: "No. We are a healthcare technology platform that connects patients with doctors, hospitals, and pharmacies in real-time."
    },
    {
      q: "How does the AI Triage work?",
      a: "Our advanced NLP engine assesses your symptoms and uses historical medical data to determine urgency, instantly routing you to the correct care path."
    },
    {
      q: "Is patient data secure?",
      a: "Yes. All health records are end-to-end encrypted and strictly comply with the highest international data protection standards in healthcare."
    },
    {
      q: "When will NAIVAIDYA be available in my city?",
      a: "We are currently rolling out in select major metropolitan areas and expanding rapidly. Join the waitlist to get notified when we launch near you."
    }
  ];

  return (
    <section id="faq" className="py-32 relative bg-[#0a0a0f] overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-bold text-primary uppercase tracking-widest mb-4"
            >
              FAQ
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Common <span className="text-gradient">Questions.</span>
            </motion.h3>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 rounded-2xl px-6 bg-black/40 data-[state=open]:bg-white/5 transition-colors">
                  <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors py-6 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 text-base leading-relaxed pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
