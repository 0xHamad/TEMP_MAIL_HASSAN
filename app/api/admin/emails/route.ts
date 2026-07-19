import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
const EMAIL_STORE = "/opt/emails";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(req: Request) {
  try {
    const adminCookie = req.headers.get("cookie")?.includes("admin_session=true");
    if (!adminCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!fs.existsSync(EMAIL_STORE)) {
      return NextResponse.json({ emails: [] });
    }

    const files = fs.readdirSync(EMAIL_STORE);
    let allEmails: any[] = [];
    const now = Date.now();

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      
      const filePath = path.join(EMAIL_STORE, file);
      
      // Auto-delete files older than 1 day
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > ONE_DAY_MS) {
        try {
          fs.unlinkSync(filePath);
          continue;
        } catch (e) {
          console.error(`Failed to delete old file: ${filePath}`);
        }
      }

      try {
        const content = fs.readFileSync(filePath, "utf8");
        const parsed = JSON.parse(content);
        
        // Target email address from filename
        const toEmail = file.replace(".json", "");
        
        // parsed could be an array of emails
        if (Array.isArray(parsed)) {
          parsed.forEach((e: any, index: number) => {
            let ts = Date.now();
            if (typeof e.received_at === 'number') ts = e.received_at;
            else if (typeof e.received_at === 'string') ts = new Date(e.received_at).getTime();
            else if (typeof e.date === 'string') ts = new Date(e.date).getTime();
            else if (typeof e.timestamp === 'number') ts = e.timestamp;
            if (isNaN(ts)) ts = stats.mtimeMs;

            allEmails.push({
              id: e.id || e.messageId || `msg-${toEmail}-${index}`,
              to: toEmail,
              from: e.from_name || e.from || "Unknown",
              subject: e.subject || "(No Subject)",
              body_text: e.body_text || e.text || e.body || "",
              received_at: ts,
            });
          });
        }
      } catch (err) {
        console.error(`Failed to read/parse ${file}`, err);
      }
    }

    // Sort globally by newest
    allEmails.sort((a, b) => b.received_at - a.received_at);

    // Limit to 1000 to prevent huge payloads
    return NextResponse.json({ emails: allEmails.slice(0, 1000) });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}
