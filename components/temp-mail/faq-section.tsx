"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is TempMail Pro completely free?",
    a: "Yes — 100% free, forever. We generate revenue through non-intrusive ads, so you never need to pay or register.",
  },
  {
    q: "How long does my temporary email last?",
    a: "By default, each address lasts 10 minutes. You can extend it in 10-minute increments as many times as you like by clicking the '+10m' button in the inbox toolbar.",
  },
  {
    q: "Can I send emails from a temp address?",
    a: "Currently, temp addresses are receive-only. Outbound sending is on our roadmap for a future release.",
  },
  {
    q: "Are the emails private?",
    a: "Emails are stored temporarily on our servers and deleted when the address expires. We never sell or share your data with third parties.",
  },
  {
    q: "Why might some sites block temp-mail addresses?",
    a: "Some services maintain blocklists of known disposable domains. We offer 8 different domains to help you work around basic filters. If one domain is blocked, try generating a new address with a different domain suffix.",
  },
  {
    q: "Can I use this for important accounts?",
    a: "We strongly recommend using temp emails only for sign-ups where you don't want spam. For important accounts (banking, work, etc.) always use a permanent address that you control.",
  },
  {
    q: "How do I access the API?",
    a: "Our REST API is open and requires no API key. Simply make a GET request to /api/inbox?email=<address> to retrieve emails. See the API section above for code examples.",
  },
  {
    q: "Is there a limit on how many emails I can receive?",
    a: "There is no hard cap. In practice, the inbox is most efficient for low-volume transactional emails like OTPs and verification links.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 bg-muted/30 border-t border-border">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Common questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground">
            Can&apos;t find what you&apos;re looking for? Open a GitHub issue.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-border bg-white overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-muted/30 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
