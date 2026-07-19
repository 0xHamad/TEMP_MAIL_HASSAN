"use client";

import { motion } from "framer-motion";
import { Mail, Shield, Zap } from "lucide-react";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "API", href: "#api" },
  { label: "FAQ", href: "#faq" },
];

const features = [
  { icon: Shield, label: "Privacy First" },
  { icon: Zap, label: "Instant Delivery" },
  { icon: Mail, label: "No Registration" },
];

export function Footer() {
  const handleClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 border border-primary/20">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-bold text-foreground">
                Hassan<span className="text-primary"> Temp Mail</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[260px]">
              Instant disposable email addresses. Protect your privacy, avoid spam, stay anonymous online.
            </p>
            <div className="flex flex-wrap gap-2">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-xs text-muted-foreground"
                >
                  <Icon className="w-3 h-3 text-primary" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Hassan Temp Mail. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 status-dot-live" />
            All systems operational
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
