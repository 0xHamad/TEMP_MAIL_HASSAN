"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw, Copy, Check, Share2, Trash2, Zap, Mail, Timer,
  AlertCircle, AtSign, ChevronDown, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import { useEmailStore } from "@/lib/email-store";
import { TempMailInbox } from "@/components/temp-mail/inbox-section";

const DOMAINS = [
  "mail.hassanai.xyz", "inbox.hassanai.xyz", "temp.hassanai.xyz",
  "relay.hassanai.xyz", "secure.hassanai.xyz", "vault.hassanai.xyz",
  "drop.hassanai.xyz", "ghost.hassanai.xyz", "cloud.hassanai.xyz",
  "swift.hassanai.xyz", "pulse.hassanai.xyz", "spark.hassanai.xyz",
  "nova.hassanai.xyz", "nexus.hassanai.xyz",
];

function useCountdown(expiresAt: number) {
  const [remaining, setRemaining] = useState<number>(0);
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  return {
    formatted: `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`,
    isLow: remaining <= 60 && remaining > 0,
    isExpired: remaining === 0,
  };
}

// ── Gmail Tab ──────────────────────────────────────────────────────────────────
function GmailTab() {
  const { currentEmail, isGenerating, generateGmailAlias } = useEmailStore();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(currentEmail).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentEmail]);

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: "My Gmail Alias", text: currentEmail }).catch(() => {});
    else handleCopy();
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
        <p className="text-[10px] text-blue-500/70 uppercase tracking-wider mb-2 font-medium">Generated Gmail Alias</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={isGenerating ? "gen" : currentEmail}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={`font-mono text-base sm:text-lg font-semibold tracking-wide break-all ${
              isGenerating ? "text-muted-foreground" : "text-foreground"
            }`}
          >
            {isGenerating ? "Generating alias…" : currentEmail}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button
          onClick={generateGmailAlias}
          disabled={isGenerating}
          className="h-10 text-xs gap-1.5 bg-blue-600 hover:bg-blue-500 text-white col-span-2 sm:col-span-1 disabled:opacity-50"
        >
          <motion.div
            animate={isGenerating ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.6, ease: "linear", repeat: isGenerating ? Infinity : 0 }}
          >
            <Zap className="w-3.5 h-3.5" />
          </motion.div>
          {isGenerating ? "Generating…" : "New Alias"}
        </Button>
        <Button onClick={handleCopy} variant="outline" className="h-10 text-xs gap-1.5">
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button
          onClick={() => setShowQr(!showQr)}
          variant="outline"
          className={`h-10 text-xs gap-1.5 ${showQr ? "border-blue-500/30 text-blue-600" : ""}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          QR Code
        </Button>
        <Button onClick={handleShare} variant="outline" className="h-10 text-xs gap-1.5">
          <Share2 className="w-3.5 h-3.5" />
          Share
        </Button>
      </div>

      <p className="text-[11px] text-muted-foreground text-center">
        This alias forwards to your real Gmail inbox. Emails appear in the inbox below.
      </p>

      <AnimatePresence>
        {showQr && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-border flex flex-col items-center gap-3">
              <p className="text-xs text-muted-foreground">Scan to send an email to this alias</p>
              <div className="p-3 rounded-xl bg-white shadow-md border border-border">
                <QRCodeSVG value={`mailto:${currentEmail}`} size={140} bgColor="#ffffff" fgColor="#0f172a" level="M" />
              </div>
              <p className="text-[11px] font-mono text-muted-foreground break-all">{currentEmail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Temp Mail Tab ──────────────────────────────────────────────────────────────
function TempMailTab() {
  const { currentEmail, expiresAt, isGenerating, generateNewEmail, extendTime, deleteInbox } = useEmailStore();
  const [username, setUsername] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(DOMAINS[0]);
  const [mounted, setMounted] = useState(false);
  const [domainOpen, setDomainOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [extendAnim, setExtendAnim] = useState(false);
  const { formatted, isLow, isExpired } = useCountdown(expiresAt);

  useEffect(() => {
    setMounted(true);
    const [user, domain] = currentEmail.split("@");
    setUsername(user ?? "x8fk2q");
    if (domain && DOMAINS.includes(domain)) setSelectedDomain(domain);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const [user, domain] = currentEmail.split("@");
    setUsername(user ?? "");
    if (domain && DOMAINS.includes(domain)) setSelectedDomain(domain);
  }, [currentEmail, mounted]);

  useEffect(() => {
    if (isExpired && mounted) generateNewEmail();
  }, [isExpired, mounted, generateNewEmail]);

  const email = mounted ? `${username}@${selectedDomain}` : currentEmail;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(email).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [email]);

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: "My Temp Email", text: email }).catch(() => {});
    else handleCopy();
  };

  const handleExtend = () => {
    extendTime();
    setExtendAnim(true);
    setTimeout(() => setExtendAnim(false), 1500);
  };

  return (
    <div className="space-y-4">
      {/* Email preview */}
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
        <p className="text-[10px] text-primary/70 uppercase tracking-wider mb-2 font-medium">Your email address</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={isGenerating ? "gen" : email}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={`font-mono text-base sm:text-lg font-semibold tracking-wide break-all ${
              isGenerating ? "text-muted-foreground" : "text-foreground"
            }`}
          >
            {isGenerating ? "Generating address…" : email}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Username + Domain pickers */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block font-medium">
            Username
          </label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
            placeholder="Custom username…"
            className="h-10 bg-white border-border rounded-xl font-mono text-sm"
          />
        </div>
        <div className="sm:w-52">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block font-medium">
            Domain
          </label>
          <div className="relative" style={{ zIndex: domainOpen ? 9999 : "auto" }}>
            <button
              onClick={() => setDomainOpen(!domainOpen)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-white hover:bg-muted text-sm text-left flex items-center justify-between gap-2 transition-all hover:border-primary/40"
            >
              <span className="text-xs font-mono text-foreground/80 truncate">@{selectedDomain}</span>
              <motion.div animate={{ rotate: domainOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </motion.div>
            </button>
            <AnimatePresence>
              {domainOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-border bg-white shadow-xl overflow-hidden"
                  style={{ zIndex: 9999 }}
                >
                  <div className="overflow-y-auto" style={{ maxHeight: 200 }}>
                    {DOMAINS.map((d) => (
                      <button
                        key={d}
                        onClick={() => { setSelectedDomain(d); setDomainOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors hover:bg-muted flex items-center gap-2 ${
                          d === selectedDomain ? "text-primary bg-primary/5" : "text-foreground/70"
                        }`}
                      >
                        <span className="text-muted-foreground/50">@</span>
                        <span>{d}</span>
                        {d === selectedDomain && <Check className="w-3 h-3 text-primary ml-auto" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button
          onClick={generateNewEmail}
          disabled={isGenerating}
          className="h-10 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-white col-span-2 sm:col-span-1"
        >
          <motion.div
            animate={isGenerating ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.6, ease: "linear", repeat: isGenerating ? Infinity : 0 }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </motion.div>
          {isGenerating ? "Generating…" : "New Email"}
        </Button>
        <Button onClick={handleCopy} variant="outline" className="h-10 text-xs gap-1.5">
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button
          onClick={() => setShowQr(!showQr)}
          variant="outline"
          className={`h-10 text-xs gap-1.5 ${showQr ? "border-primary/30 text-primary" : ""}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          QR Code
        </Button>
        <Button onClick={handleShare} variant="outline" className="h-10 text-xs gap-1.5">
          <Share2 className="w-3.5 h-3.5" />
          Share
        </Button>
      </div>

      {/* Secondary actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => setShowDeleteConfirm(true)}
          className="h-8 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-3 h-3" />
          Delete Inbox
        </Button>
        <Button
          variant="ghost"
          onClick={handleExtend}
          className={`h-8 text-xs gap-1.5 transition-all ${
            extendAnim ? "text-green-600 bg-green-50" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <motion.div animate={extendAnim ? { rotate: [0, 360] } : {}} transition={{ duration: 0.6 }}>
            <Zap className="w-3 h-3" />
          </motion.div>
          {extendAnim ? "+10 min added!" : "Extend Time"}
        </Button>
      </div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground mb-1">Delete this inbox?</p>
                  <p className="text-[11px] text-muted-foreground mb-3">
                    A new address will be generated. All current emails will be lost.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => { deleteInbox(); setShowDeleteConfirm(false); setShowQr(false); }}
                      className="h-7 text-[11px] gap-1 bg-destructive hover:bg-destructive/90 text-white"
                    >
                      <Trash2 className="w-3 h-3" /> Yes, Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="h-7 text-[11px]"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code */}
      <AnimatePresence>
        {showQr && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-border flex flex-col items-center gap-3">
              <p className="text-xs text-muted-foreground">Scan to send to this address</p>
              <div className="p-3 rounded-xl bg-white shadow-md border border-border">
                <QRCodeSVG value={`mailto:${email}`} size={140} bgColor="#ffffff" fgColor="#0f172a" level="M" />
              </div>
              <p className="text-[11px] font-mono text-muted-foreground break-all">{email}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main GenerateSection ───────────────────────────────────────────────────────
export function GenerateSection() {
  const { expiresAt, activeMode, setActiveMode } = useEmailStore();
  const { formatted, isLow, isExpired } = useCountdown(expiresAt);

  return (
    <section id="generate" className="relative py-20 px-4 sm:px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <Zap className="w-3 h-3" />
            Email Generator
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Generate your <span className="gradient-text">email address</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Disposable temp email or Gmail dot-trick aliases — all in one place.
          </p>
        </motion.div>

        {/* Generator card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded-3xl border border-border bg-white shadow-lg p-6 sm:p-8">
            {/* Card header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Email Generator</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 status-dot-live" />
                    <span className="text-[10px] text-muted-foreground">Server Online</span>
                  </div>
                </div>
              </div>

              {/* Countdown / mode badge */}
              {activeMode === "temp" && (
                <motion.div
                  animate={isLow ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isLow ? Infinity : 0, repeatDelay: 0.5 }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all ${
                    isExpired
                      ? "bg-destructive/10 text-destructive border-destructive/30"
                      : isLow
                      ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                      : "bg-primary/10 text-primary border-primary/20"
                  }`}
                >
                  <Timer className="w-3 h-3" />
                  {isExpired ? "Expired" : `Expires: ${formatted}`}
                </motion.div>
              )}
              {activeMode === "gmail" && (
                <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                  Gmail Aliases
                </Badge>
              )}
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 p-1 rounded-2xl bg-muted border border-border mb-6">
              <button
                onClick={() => setActiveMode("temp")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                  activeMode === "temp"
                    ? "bg-white text-primary border border-primary/20 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Temp Mail
              </button>
              <button
                onClick={() => setActiveMode("gmail")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                  activeMode === "gmail"
                    ? "bg-white text-blue-600 border border-blue-200 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <AtSign className="w-3.5 h-3.5" />
                Gmail Aliases
              </button>
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {activeMode === "temp" ? (
                <motion.div
                  key="temp"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TempMailTab />
                </motion.div>
              ) : (
                <motion.div
                  key="gmail"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <GmailTab />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Inbox embedded below */}
          <div className="mt-6">
            <TempMailInbox />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
