"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Mail, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminOverview() {
  const [stats, setStats] = useState<{ totalSessions: number, uniqueIps: number, emailsCreatedToday: number, ipList?: string[] }>({ 
    totalSessions: 0, uniqueIps: 0, emailsCreatedToday: 0, ipList: [] 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground text-sm">Today's live analytics and usage stats.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          title="Active Sessions" 
          value={loading ? "..." : stats.totalSessions.toString()} 
          icon={<Activity className="w-5 h-5 text-blue-500" />} 
          subtitle="Page loads today"
        />
        <StatCard 
          title="Emails Generated" 
          value={loading ? "..." : stats.emailsCreatedToday.toString()} 
          icon={<Mail className="w-5 h-5 text-green-500" />} 
          subtitle="Temp & Gmail aliases"
        />
        <StatCard 
          title="Unique IPs" 
          value={loading ? "..." : stats.uniqueIps.toString()} 
          icon={<Users className="w-5 h-5 text-purple-500" />} 
          subtitle="Distinct visitors today"
        />
      </div>

      {/* IP List Section */}
      <Card className="rounded-2xl border-border shadow-sm mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Visitors (IP Addresses)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading IPs...</p>
          ) : stats.ipList && stats.ipList.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {stats.ipList.map((ip, i) => (
                <div key={i} className="px-3 py-1.5 bg-muted/50 border border-border rounded-lg text-xs font-mono text-foreground">
                  {ip}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No IP addresses recorded today.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatCard({ title, value, icon, subtitle }: { title: string, value: string, icon: React.ReactNode, subtitle: string }) {
  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-muted rounded-xl">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
