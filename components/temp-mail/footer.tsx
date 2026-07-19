"use client";

import { motion } from "framer-motion";
import { Mail, GitFork, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-10 px-4 sm:px-6 border-t border-border bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2.5"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-primary/10 border border-primary/20">
              <Mail className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground">
              TempMail<span className="text-primary"> Pro</span>
            </span>
          </motion.div>

          {/* Center */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-muted-foreground flex items-center gap-1.5"
          >
            Built with <Heart className="w-3 h-3 text-red-400" fill="currentColor" /> by{" "}
            <a
              href="https://github.com/0xHamad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              0xHamad
            </a>
          </motion.p>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <a
              href="https://github.com/0xHamad/TEMP_MAIL_HASSAN"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <GitFork className="w-3.5 h-3.5" />
              GitHub
            </a>
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} TempMail Pro. All rights reserved.
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
