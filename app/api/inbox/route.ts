import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const EMAIL_STORE = "/opt/emails";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().replace(/[^a-z0-9@.-]/g, "");
    const filePath = path.join(EMAIL_STORE, `${cleanEmail}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ emails: [] });
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    let parsedEmails = [];
    try {
      parsedEmails = JSON.parse(fileContent);
    } catch (e) {
      parsedEmails = [];
    }

    // Ensure Haraka JSON structure matches frontend expectations
    const emails = parsedEmails.map((e: any, index: number) => {
      // Handle various date formats (timestamp, ISO string, or fallback)
      let ts = Date.now();
      if (typeof e.received_at === 'number') ts = e.received_at;
      else if (typeof e.received_at === 'string') ts = new Date(e.received_at).getTime();
      else if (typeof e.date === 'string') ts = new Date(e.date).getTime();
      else if (typeof e.timestamp === 'number') ts = e.timestamp;
      
      if (isNaN(ts)) ts = Date.now();

      return {
        id: e.id || e.messageId || `msg-${index}-${ts}`,
        from: e.from || "Unknown",
        from_name: e.from_name || e.from || "Unknown",
        subject: e.subject || "(No Subject)",
        body_html: e.body_html || e.html || "",
        body_text: e.body_text || e.text || e.body || "",
        received_at: ts,
        read: e.read || false,
      };
    });

    // Sort by newest first
    emails.sort((a, b) => b.received_at - a.received_at);

    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Inbox fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
