"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Code2, Terminal, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "fetch", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "curl", label: "cURL" },
];

const codeExamples: Record<string, string> = {
  fetch: `// Fetch inbox for a temporary email address
const email = "x8fk2q@mail.hassanai.xyz";

const res = await fetch(
  \`https://hassanai.xyz/api/inbox?email=\${email}\`
);

const { emails } = await res.json();

emails.forEach((msg) => {
  console.log(\`From: \${msg.from}\`);
  console.log(\`Subject: \${msg.subject}\`);
  console.log(\`Body: \${msg.body_text}\`);
});`,

  python: `import httpx

email = "x8fk2q@mail.hassanai.xyz"

response = httpx.get(
    "https://hassanai.xyz/api/inbox",
    params={"email": email}
)

data = response.json()

for msg in data["emails"]:
    print(f"From: {msg['from']}")
    print(f"Subject: {msg['subject']}")
    print(f"Body: {msg['body_text']}")`,

  curl: `# Fetch inbox for a temporary email address
curl -X GET \\
  "https://hassanai.xyz/api/inbox?email=x8fk2q@mail.hassanai.xyz" \\
  -H "Accept: application/json"

# Response example:
# {
#   "emails": [
#     {
#       "id": "abc123",
#       "from": "noreply@github.com",
#       "from_name": "GitHub",
#       "subject": "Verify your email",
#       "body_text": "...",
#       "received_at": 1720000000000
#     }
#   ]
# }`,
};

const endpoints = [
  {
    method: "GET",
    path: "/api/inbox",
    desc: "Fetch all emails for an address",
    params: ["email (required)"],
    color: "text-green-600 bg-green-50 border-green-200",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-all text-xs"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function ApiSection() {
  const [activeTab, setActiveTab] = useState("fetch");

  return (
    <section id="api" className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <Code2 className="w-3.5 h-3.5" />
            Developer API
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Programmatic <span className="gradient-text">Access</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Integrate temp-mail functionality directly into your apps, scripts, and CI/CD pipelines.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: endpoints */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            className="lg:col-span-2 space-y-4"
          >
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Terminal className="w-4 h-4 text-muted-foreground" />
              Endpoints
            </h3>

            {endpoints.map((ep) => (
              <div key={ep.path} className="rounded-xl border border-border bg-white p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${ep.color}`}>
                    {ep.method}
                  </span>
                  <code className="text-xs font-mono text-foreground">{ep.path}</code>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{ep.desc}</p>
                <div className="space-y-1">
                  {ep.params.map((p) => (
                    <div key={p} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <code className="text-[11px] font-mono text-muted-foreground">{p}</code>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">No API Key Required</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Our public API is free to use and requires no authentication. Rate limit: 60 req/min per IP.
              </p>
            </div>
          </motion.div>

          {/* Right: code */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm code-block">
              {/* Code tab bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[oklch(0.20_0.01_260)] border-b border-white/10">
                <div className="flex gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-1 rounded-md text-xs transition-all ${
                        activeTab === tab.id
                          ? "bg-white/15 text-white font-medium"
                          : "text-white/50 hover:text-white/75 hover:bg-white/10"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <CopyButton text={codeExamples[activeTab]} />
              </div>

              {/* Code content */}
              <div className="p-5 overflow-x-auto">
                <pre className="text-xs leading-relaxed font-mono">
                  {codeExamples[activeTab].split("\n").map((line, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="select-none text-white/20 w-5 text-right flex-shrink-0">
                        {i + 1}
                      </span>
                      <span
                        className="text-[#e6edf3] flex-1"
                        dangerouslySetInnerHTML={{
                          __html: (() => {
                            const escaped = line
                              .replace(/&/g, "&amp;")
                              .replace(/</g, "&lt;")
                              .replace(/>/g, "&gt;");
                            // Comments take full precedence — match from // or # to end of line
                            if (/^\s*(\/\/|#)/.test(escaped)) {
                              return `<span style="color:#8b949e">${escaped}</span>`;
                            }
                            const inlineComment = escaped.match(/^(.*?)(\/\/.*)$/);
                            const commentPart = inlineComment ? inlineComment[2] : "";
                            const codePart = inlineComment ? inlineComment[1] : escaped;
                            const highlighted = codePart
                              .replace(/\b(const|let|var|async|await|import|from|for|of|return|print)\b/g, '<span style="color:#ff7b72">$1</span>')
                              .replace(/(`[^`]*`)/g, '<span style="color:#79c0ff">$1</span>')
                              .replace(/("[^"]*")/g, '<span style="color:#a5d6ff">$1</span>')
                              .replace(/('[^']*')/g, '<span style="color:#a5d6ff">$1</span>');
                            return highlighted + (commentPart ? `<span style="color:#8b949e">${commentPart}</span>` : "");
                          })(),
                        }}
                      />
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
