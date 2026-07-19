"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, RefreshCw, Shield, ArrowDown, Timer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEmailStore } from "@/lib/email-store";

function useCountdown(expiresAt: number) {
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setRemaining(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  return {
    formatted,
    isLow: remaining <= 60 && remaining > 0,
    isExpired: remaining === 0,
  };
}

export function HeroSection() {
  const { currentEmail, expiresAt, isGenerating, generateNewEmail } = useEmailStore();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { formatted, isLow, isExpired } = useCountdown(expiresAt);

  useEffect(() => { setMounted(true); }, []);

  const email = mounted ? currentEmail : "x8fk2q@mail.hassanai.xyz";

  const handleCopy = () => {
    navigator.clipboard.writeText(email).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScrollToInbox = () => {
    document.querySelector("#generate")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-accent/5 rounded-full blur-[120px] animate-blob-delay" />
        <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-cyan-accent/4 rounded-full blur-[100px] animate-blob-delay-2" />
        <div className="absolute inset-0 grid-bg opacity-60" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm text-xs text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-green-500 status-dot-live" />
            <span>All systems operational</span>
            <span className="h-3 w-px bg-border" />
            <span className="text-primary font-semibold">100% Free</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6"
        >
          <span className="text-foreground">Hassan</span>
          <br />
          <span className="gradient-text">Temp Mail</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Generate a secure temp email in one click. Receive emails instantly — no sign-up, no tracking, no spam.
        </motion.p>

        {/* Email card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.44 }}
          className="relative max-w-lg mx-auto mb-8"
        >
          {/* Floating badges */}
          <div className="absolute -left-6 top-1/3 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-border shadow-md"
            >
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs text-foreground whitespace-nowrap">256-bit Encrypted</span>
            </motion.div>
          </div>
          <div className="absolute -right-6 top-1/3 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-border shadow-md"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs text-foreground whitespace-nowrap">Zero Registration</span>
            </motion.div>
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-white border border-border shadow-lg p-5">
            {/* Card header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 status-dot-live" />
                <span className="text-xs text-muted-foreground font-mono">Active Inbox</span>
              </div>
              <motion.div
                animate={isLow ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.5, repeat: isLow ? Infinity : 0, repeatDelay: 0.5 }}
              >
                <Badge
                  className={`h-5 text-[10px] font-mono flex items-center gap-1 ${
                    isExpired
                      ? "bg-red-50 text-red-600 border-red-200"
                      : isLow
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-primary/10 text-primary border-primary/20"
                  }`}
                >
                  <Timer className="w-2.5 h-2.5" />
                  {mounted ? (isExpired ? "Expired" : formatted) : "10:00"}
                </Badge>
              </motion.div>
            </div>

            {/* Email display */}
            <div className="email-highlight rounded-xl px-4 py-4 flex items-center justify-between gap-3 mb-4">
              <AnimatePresence mode="wait">
                <motion.span
                  key={isGenerating ? "generating" : email}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className={`font-mono text-sm sm:text-base font-semibold tracking-wide truncate ${
                    isGenerating ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {isGenerating ? "Generating..." : email}
                </motion.span>
              </AnimatePresence>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 p-2 rounded-lg hover:bg-black/5 transition-all"
                aria-label="Copy email"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Check className="w-4 h-4 text-green-600" />
                    </motion.div>
                  ) : (
                    <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={generateNewEmail}
                disabled={isGenerating}
                className="flex-1 h-10 text-sm gap-2 bg-primary hover:bg-primary/90 text-white shadow-sm"
              >
                <motion.div
                  animate={isGenerating ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.6, ease: "linear", repeat: isGenerating ? Infinity : 0 }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                {isGenerating ? "Generating..." : "New Email"}
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex-1 h-10 text-sm gap-2 border-border hover:bg-muted"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-8 sm:gap-12 mb-14 flex-wrap"
        >
          {[
            { value: "10M+", label: "Emails Generated" },
            { value: "2.4M", label: "Active Users" },
            { value: "99.9%", label: "Uptime" },
            { value: "< 1s", label: "Delivery Speed" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          onClick={handleScrollToInbox}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Scroll to inbox"
        >
          <span className="text-xs">Open Inbox</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowDown className="w-4 h-4 hover:text-primary transition-colors" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}
