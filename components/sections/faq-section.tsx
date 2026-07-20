"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is it beginner friendly?",
    answer:
      "Yes! Our tool is designed with a user-friendly interface that requires no coding knowledge. Simply upload your list of websites, and our system handles all the technical aspects of scraping and template generation.",
  },
  {
    question: "Can I resell the websites?",
    answer:
      "Absolutely! That's the main purpose of our tool. You retain 100% ownership of all generated templates and can sell them to businesses without any restrictions or royalty fees.",
  },
  {
    question: "Do I need coding knowledge?",
    answer:
      "No coding knowledge is required. The tool automatically extracts data and creates professional templates. However, if you wish to make custom adjustments, basic HTML/CSS knowledge can be helpful but not necessary.",
  },
  {
    question: "How do I get updates?",
    answer:
      "As a lifetime member, you'll receive all future updates for free. We regularly add new features, template designs, and improve our scraping algorithms based on user feedback.",
  },
  {
    question: "How many websites can I generate?",
    answer:
      "There are no limits on the number of websites you can generate. Our one-time purchase gives you unlimited usage without any hidden fees or charges.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with the tool for any reason, contact our support team within 30 days of purchase for a full refund.",
  },
];

export function FaqSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  return (
    <section id="faq" ref={sectionRef} className="py-20 md:py-28 relative section-divider-top">
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid-bg opacity-10 pointer-events-none" />
      <div className="absolute top-[20%] right-[15%] w-[350px] h-[350px] bg-violet-500/[0.03] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[15%] w-[300px] h-[300px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-1.5 mb-6"
          >
            <HelpCircle className="h-3 w-3 text-indigo-400" />
            <span className="text-[13px] text-white/40 font-medium tracking-wide">Got Questions?</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Questions</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg text-white/40">
              Everything you need to know about our website generator
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {/* Glassmorphic container around accordion */}
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-4 sm:p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-white/[0.04] last:border-b-0"
                >
                  <AccordionTrigger className="text-left text-base sm:text-lg font-medium py-5 text-white/70 hover:text-white/90 transition-colors duration-200 hover:no-underline cursor-pointer [&[data-state=open]]:text-white">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/35 text-sm sm:text-base leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
}