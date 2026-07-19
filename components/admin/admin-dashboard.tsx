"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, Globe, Mail, Code, Search, RefreshCw, 
  Trash2, Plus, ArrowUpRight, Copy, Check, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Sub-components
import { AdminOverview } from "./admin-overview";
import { AdminEmails } from "./admin-emails";
import { AdminDomains } from "./admin-domains";
import { AdminApiDocs } from "./admin-api-docs";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "emails" | "domains" | "api">("overview");
  const router = useRouter();

  const handleLogout = async () => {
    document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col sm:flex-row">
      {/* Sidebar */}
      <div className="w-full sm:w-64 bg-white border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Temp Mail Dashboard</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <NavButton 
            icon={<BarChart3 className="w-4 h-4" />} 
            label="Overview" 
            isActive={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")} 
          />
          <NavButton 
            icon={<Mail className="w-4 h-4" />} 
            label="Global Inbox" 
            isActive={activeTab === "emails"} 
            onClick={() => setActiveTab("emails")} 
          />
          <NavButton 
            icon={<Globe className="w-4 h-4" />} 
            label="Domains" 
            isActive={activeTab === "domains"} 
            onClick={() => setActiveTab("domains")} 
          />
          <NavButton 
            icon={<Code className="w-4 h-4" />} 
            label="API & Docs" 
            isActive={activeTab === "api"} 
            onClick={() => setActiveTab("api")} 
          />
        </div>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto bg-muted/10 p-4 sm:p-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && <AdminOverview key="overview" />}
          {activeTab === "emails" && <AdminEmails key="emails" />}
          {activeTab === "domains" && <AdminDomains key="domains" />}
          {activeTab === "api" && <AdminApiDocs key="api" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NavButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        isActive 
          ? "bg-primary text-white shadow-md shadow-primary/20" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
