"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, Mail, Calendar, ArrowLeft, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminEmails() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  const fetchEmails = () => {
    setLoading(true);
    fetch("/api/admin/emails")
      .then(res => res.json())
      .then(data => {
        if (data.emails) setEmails(data.emails);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const filtered = emails.filter(e => 
    e.to.toLowerCase().includes(search.toLowerCase()) || 
    e.from.toLowerCase().includes(search.toLowerCase()) ||
    e.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Global Inbox</h2>
          <p className="text-muted-foreground text-sm">View all incoming emails across all domains (kept for 24 hours).</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by address or subject..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 w-full sm:w-64 bg-white"
            />
          </div>
          <Button variant="outline" onClick={fetchEmails} disabled={loading} className="gap-2 shrink-0">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white border border-border rounded-2xl shadow-sm flex overflow-hidden">
        {/* Email List */}
        <div className={`w-full ${selected ? "hidden sm:flex sm:w-1/3" : "flex"} flex-col border-r border-border`}>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {loading && emails.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading emails...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No emails found</div>
            ) : (
              filtered.map((e, i) => (
                <div 
                  key={e.id || i}
                  onClick={() => setSelected(e)}
                  className={`p-3 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors ${selected?.id === e.id ? "bg-primary/5" : ""}`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-semibold text-foreground truncate mr-2">{e.to}</span>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {new Date(e.received_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-xs text-foreground truncate font-medium">{e.subject}</p>
                  <p className="text-[11px] text-muted-foreground truncate">From: {e.from}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Email Viewer */}
        {selected ? (
          <div className="flex-1 flex flex-col min-w-0 bg-muted/5">
            <div className="p-4 border-b border-border bg-white flex items-center gap-3">
              <button onClick={() => setSelected(null)} className="sm:hidden p-2 rounded-lg hover:bg-muted">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-foreground truncate">{selected.subject}</h3>
                <div className="text-xs text-muted-foreground mt-1 flex flex-col gap-0.5">
                  <span className="truncate">To: {selected.to}</span>
                  <span className="truncate">From: {selected.from}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Calendar className="w-3 h-3" />
                {new Date(selected.received_at).toLocaleString()}
              </div>
              <button onClick={() => setSelected(null)} className="hidden sm:flex p-2 rounded-lg hover:bg-muted ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              {selected.body_html ? (
                <div dangerouslySetInnerHTML={{ __html: selected.body_html }} className="prose prose-sm max-w-none" />
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-xs">{selected.body_text}</pre>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex flex-1 items-center justify-center text-muted-foreground flex-col gap-4">
            <Mail className="w-12 h-12 opacity-20" />
            <p className="text-sm">Select an email to view it here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
