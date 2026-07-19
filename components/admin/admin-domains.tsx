"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Plus, Trash2, Check, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminDomains() {
  const [domains, setDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchDomains = () => {
    fetch("/api/domains")
      .then(res => res.json())
      .then(data => {
        if (data.domains) setDomains(data.domains);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;
    
    setAdding(true);
    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: newDomain.toLowerCase().trim(), password: "78651214" })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Domain added successfully");
        setNewDomain("");
        fetchDomains();
      } else {
        toast.error(data.error || "Failed to add domain");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Domain Management</h2>
        <p className="text-muted-foreground text-sm">Manage the active domains available for generating temp emails.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Add New Domain</CardTitle>
            <CardDescription>
              Users will immediately see this domain in the dropdown. 
              You must configure Cloudflare DNS manually to point to this server.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="flex gap-2">
              <Input 
                placeholder="e.g. secret.hassanai.xyz" 
                value={newDomain}
                onChange={e => setNewDomain(e.target.value)}
                className="bg-muted/30"
              />
              <Button type="submit" disabled={adding || !newDomain} className="gap-2">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Active Domains ({domains.length})</CardTitle>
            <CardDescription>Domains currently active in the database.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading domains...</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {domains.map(d => (
                  <div key={d} className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{d}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`https://${d}`} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-muted rounded-md text-muted-foreground">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
