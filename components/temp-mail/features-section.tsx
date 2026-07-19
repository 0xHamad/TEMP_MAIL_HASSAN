"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  RefreshCw,
  Globe,
  Clock,
  Lock,
  Inbox,
  Eye,
  Trash2,
  WifiOff,
  Code2,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Get a working temp email in under a second. No forms, no CAPTCHAs, no waiting.",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your real identity stays hidden. We collect zero personally identifiable information.",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: RefreshCw,
    title: "Auto-Refresh Inbox",
    description: "Emails appear automatically every 15 seconds — no page reload needed.",
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  {
    icon: Globe,
    title: "8 Domains",
    description: "Choose from 8 different domain suffixes to bypass site filters and restrictions.",
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    icon: Clock,
    title: "Extendable Timer",
    description: "Default 10-minute lifespan. Click '+10m' anytime to extend without losing emails.",
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
  {
    icon: Lock,
    title: "Encrypted Transport",
    description: "All traffic between you and our servers is encrypted end-to-end with TLS.",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-100",
  },
  {
    icon: Inbox,
    title: "HTML Email Rendering",
    description: "Emails with rich HTML — including verification buttons and OTP codes — render perfectly.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
  },
  {
    icon: Eye,
    title: "No Registration",
    description: "Use any feature without creating an account. No email, no password, no tracking cookies.",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    icon: Trash2,
    title: "One-Click Delete",
    description: "Nuke your inbox and generate a fresh address instantly with a single button.",
    color: "text-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    icon: WifiOff,
    title: "Anti-Spam",
    description: "Disposable by design — use it for a sign-up and never see marketing emails again.",
    color: "text-teal-500",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    icon: Code2,
    title: "Public API",
    description: "Developers can programmatically fetch inboxes via our lightweight REST API.",
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Fully responsive — works great on any phone, tablet, or desktop browser.",
    color: "text-sky-500",
    bg: "bg-sky-50",
    border: "border-sky-100",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 bg-muted/30 border-y border-border">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <Zap className="w-3.5 h-3.5" />
            Packed with features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything you need,{" "}
            <span className="gradient-text">nothing you don&apos;t</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Built for developers, power users, and anyone who values their privacy online.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`p-5 rounded-2xl border ${feature.border} bg-white hover:shadow-md transition-all`}
              >
                <div className={`w-9 h-9 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-4.5 h-4.5 ${feature.color}`} style={{ width: 18, height: 18 }} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
