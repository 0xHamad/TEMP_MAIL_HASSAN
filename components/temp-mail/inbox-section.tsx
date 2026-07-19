"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  RefreshCw,
  Trash2,
  Mail,
  MailOpen,
  Clock,
  Timer,
  AlertCircle,
  ChevronRight,
  X,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEmailStore } from "@/lib/email-store";
import { toast } from "sonner";

export interface EmailMessage {
  id: string;
  from: string;
  from_name: string;
  subject: string;
  body_html: string;
  body_text: string;
  received_at: number;
  read: boolean;
}

function useCountdown(expiresAt: number) {
  const [remaining, setRemaining] = useState(0);
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
    pct: Math.min(100, (remaining / 600) * 100),
  };
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatTs(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Exported so GenerateSection can embed it
export function TempMailInbox() {
  const { currentEmail, expiresAt, activeMode, extendTime, deleteInbox } = useEmailStore();
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [selected, setSelected] = useState<EmailMessage | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const isFirstFetchRef = useRef(true);
  const prevCountRef = useRef(0);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const { formatted, isLow, isExpired, pct } = useCountdown(expiresAt);

  const getApiUrl = useCallback(() => {
    if (activeMode === "gmail") {
      return `/api/gmail/inbox?email=${encodeURIComponent(currentEmail)}`;
    }
    return `/api/inbox?email=${encodeURIComponent(currentEmail)}`;
  }, [currentEmail, activeMode]);

  const fetchEmails = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setPolling(true);

    try {
      const res = await fetch(getApiUrl());
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const fetched: EmailMessage[] = data.emails ?? [];

      if (fetched.length > prevCountRef.current && !isFirstFetchRef.current) {
        const newest = fetched[0];
        if (newest) toast.success(`New email from ${newest.from_name || newest.from}`);
      }

      prevCountRef.current = fetched.length;
      setEmails(fetched);
    } catch {
      // silently fail — keep existing emails visible
    } finally {
      isFirstFetchRef.current = false;
      setLoading(false);
      setPolling(false);
    }
  }, [getApiUrl]);

  // Reset state when email address changes
  useEffect(() => {
    isFirstFetchRef.current = true;
    prevCountRef.current = 0;
    setEmails([]);
    setSelected(null);
    setReadIds(new Set());
  }, [currentEmail]);

  // Auto-poll every 15 seconds
  useEffect(() => {
    fetchEmails();
    pollingRef.current = setInterval(() => fetchEmails(true), 15000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchEmails]);

  const handleSelect = (email: EmailMessage) => {
    setSelected(email);
    setReadIds((prev) => new Set([...prev, email.id]));
    setEmails((prev) =>
      prev.map((e) => (e.id === email.id ? { ...e, read: true } : e))
    );
  };

  const handleDelete = () => {
    deleteInbox();
    setEmails([]);
    setSelected(null);
    toast.success("New address generated");
  };

  const unreadCount = emails.filter((e) => !e.read && !readIds.has(e.id)).length;

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Inbox className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-sm text-foreground">Inbox</span>
            {unreadCount > 0 && (
              <Badge className="h-5 w-5 text-[10px] flex items-center justify-center p-0 bg-primary text-white rounded-full">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 max-w-[220px] truncate px-3 py-1 rounded-lg bg-muted">
            <span className="font-mono text-[11px] text-muted-foreground truncate">{currentEmail}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Timer */}
          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono ${
            isExpired ? "bg-red-50 text-red-600" : isLow ? "bg-yellow-50 text-yellow-700" : "bg-muted text-muted-foreground"
          }`}>
            <Timer className="w-3 h-3" />
            <span>{formatted}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={extendTime}
            className="h-7 text-xs gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Clock className="w-3 h-3" />
            <span className="hidden sm:inline">+10m</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchEmails()}
            disabled={loading}
            className="h-7 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <motion.div
              animate={loading || polling ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.8, repeat: loading || polling ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </motion.div>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-7 px-2.5 text-muted-foreground hover:text-red-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Timer progress bar */}
      <div className="h-0.5 bg-muted w-full">
        <motion.div
          className={`h-full transition-colors ${isExpired ? "bg-red-400" : isLow ? "bg-yellow-400" : "bg-primary"}`}
          initial={{ width: "100%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1 }}
        />
      </div>

      {/* Body */}
      <div className="flex" style={{ minHeight: 380 }}>
        {/* Email list */}
        <div className={`flex flex-col ${selected ? "hidden sm:flex sm:w-2/5 border-r border-border" : "flex-1"}`}>
          <AnimatePresence mode="popLayout">
            {loading && emails.length === 0 ? (
              <motion.div key="loading" className="flex flex-col items-center justify-center flex-1 py-20 gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <RefreshCw className="w-6 h-6 text-muted-foreground" />
                </motion.div>
                <p className="text-sm text-muted-foreground">Checking inbox…</p>
              </motion.div>
            ) : emails.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center flex-1 py-20 gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                  <Inbox className="w-7 h-7 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">No emails yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Waiting for incoming messages…</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  Auto-refresh every 15s
                </div>
              </motion.div>
            ) : (
              <ul className="divide-y divide-border">
                {emails.map((email, i) => {
                  const isRead = email.read || readIds.has(email.id);
                  return (
                    <motion.li
                      key={email.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => handleSelect(email)}
                      className={`group flex items-start gap-3 px-4 py-3.5 cursor-pointer hover:bg-muted/50 transition-colors ${
                        selected?.id === email.id ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {isRead ? (
                          <MailOpen className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <div className="relative">
                            <Mail className="w-4 h-4 text-primary" />
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-1 mb-0.5">
                          <span className={`text-xs truncate ${isRead ? "text-muted-foreground" : "text-foreground font-semibold"}`}>
                            {email.from_name || email.from}
                          </span>
                          <span className="flex-shrink-0 text-[10px] text-muted-foreground">
                            {timeAgo(email.received_at)}
                          </span>
                        </div>
                        <p className={`text-xs truncate ${isRead ? "text-muted-foreground" : "text-foreground"}`}>
                          {email.subject}
                        </p>
                      </div>
                      <ChevronRight className="flex-shrink-0 w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </AnimatePresence>
        </div>

        {/* Email viewer */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col min-w-0"
            >
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-muted/20">
                <button
                  onClick={() => setSelected(null)}
                  className="sm:hidden p-1 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{selected.subject}</h3>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">From: {selected.from_name || selected.from}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                  <Calendar className="w-3 h-3" />
                  <span>{formatTs(selected.received_at)}</span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="hidden sm:flex p-1 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 p-5 overflow-y-auto">
                {selected.body_html ? (
                  <div
                    className="prose prose-sm max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ __html: selected.body_html }}
                  />
                ) : (
                  <pre className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                    {selected.body_text}
                  </pre>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden sm:flex flex-1 flex-col items-center justify-center gap-4 text-center p-10"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                <MailOpen className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Select an email</p>
                <p className="text-xs text-muted-foreground mt-1">Choose a message from the list to read it here</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Section wrapper used in page.tsx standalone
export function InboxSection() {
  return (
    <section id="inbox" className="py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Your <span className="gradient-text">Inbox</span>
          </h2>
          <p className="text-muted-foreground">Emails arrive here in real-time. No login required.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <TempMailInbox />
        </motion.div>
      </div>
    </section>
  );
}
