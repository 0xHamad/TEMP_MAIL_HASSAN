"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminApiDocs() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const pythonCode = `import requests
import time

# Configuration
DOMAIN = "mail.hassanai.xyz"

def check_inbox(email_address):
    """Fetches emails for a given address"""
    url = f"https://{DOMAIN}/api/inbox?email={email_address}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get("emails", [])
    return []

# Example Usage
if __name__ == "__main__":
    # You can generate any random prefix
    my_email = f"test12345@{DOMAIN}"
    print(f"Listening for emails on: {my_email}")
    
    # Poll inbox every 5 seconds
    while True:
        emails = check_inbox(my_email)
        if emails:
            print("\\n--- New Email Received! ---")
            for msg in emails:
                print(f"From: {msg['from']}")
                print(f"Subject: {msg['subject']}")
                print(f"Body: {msg['body_text']}")
            break
        print(".", end="", flush=True)
        time.sleep(5)
`;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">API Documentation</h2>
        <p className="text-muted-foreground text-sm">How to use your Temp Mail service in Python.</p>
      </div>

      <div className="bg-[#1e1e1e] rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-[#3d3d3d]">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-200">python_client.py</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleCopy(pythonCode, "py")}
            className="h-8 text-xs text-gray-400 hover:text-white hover:bg-white/10"
          >
            {copied === "py" ? <Check className="w-3.5 h-3.5 mr-1 text-green-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied === "py" ? "Copied" : "Copy Code"}
          </Button>
        </div>
        <div className="p-4 overflow-x-auto text-sm text-gray-300 font-mono leading-relaxed">
          <pre>{pythonCode}</pre>
        </div>
      </div>
    </motion.div>
  );
}
