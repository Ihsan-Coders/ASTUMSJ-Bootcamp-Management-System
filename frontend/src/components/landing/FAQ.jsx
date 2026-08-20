import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "When does registration open?",
    a: "Registration is only open during specific admission windows before each bootcamp cohort begins. Check the batch details for exact dates.",
  },
  {
    q: "What happens after I register?",
    a: "Your application is reviewed by an admin after the registration window closes. You'll be notified once your account is approved.",
  },
  {
    q: "Is there a cost to join?",
    a: "The ASTU MSJ Summer Bootcamp is a community-driven program — check with the organizing team for current details.",
  },
  {
    q: "Can I switch tracks after starting?",
    a: "Track changes are handled on a case-by-case basis — reach out to your mentor or an admin early if you'd like to discuss this.",
  },
];

function FAQItem({ faq, isOpen, onClick }) {
  return (
    <div className="glass-card glow-border rounded-xl overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="text-text-primary font-medium">{faq.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gold" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-text-secondary text-sm">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-20 px-6 max-w-3xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl font-bold text-text-primary text-center mb-12"
      >
        Frequently Asked Questions
      </motion.h2>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <FAQItem
            key={i}
            faq={faq}
            isOpen={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}
