import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is NAIVAIDYA a hospital?",
    a: "No. We are a healthcare technology platform that connects patients with doctors, hospitals, and pharmacies in real-time using AI-powered triage.",
  },
  {
    q: "How does the AI Triage work?",
    a: "Our NLP engine assesses your symptoms and uses medical data to determine urgency, routing you instantly to the correct care path — whether that is a teleconsult, emergency room, or pharmacy.",
  },
  {
    q: "Is patient data secure?",
    a: "Yes. All health records are end-to-end encrypted and comply with the highest international data protection standards in healthcare.",
  },
  {
    q: "When will NAIVAIDYA be available in my city?",
    a: "We are rolling out in select major metropolitan areas and expanding rapidly. Join the waitlist to get notified when we launch near you.",
  },
  {
    q: "Who can use NAIVAIDYA?",
    a: "NAIVAIDYA is built for patients, doctors, hospitals, pharmacies, and diagnostic centres — the entire healthcare ecosystem in one platform.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="py-32 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #F5F0FF 0%, #EDE9FE 50%, #F8F5FF 100%)" }}
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-4"
            >
              FAQ
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900"
            >
              Common{" "}
              <span className="text-gradient">Questions.</span>
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
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border border-purple-200 rounded-2xl px-6 bg-white shadow-[0_4px_16px_rgba(124,58,237,0.06)] data-[state=open]:border-[#7C3AED]/40 data-[state=open]:shadow-[0_8px_32px_rgba(124,58,237,0.12)] transition-all duration-300"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-[#7C3AED] transition-colors py-6 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 text-base leading-relaxed pb-6">
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
