import { NextResponse } from "next/server";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const masterEmail = process.env.MASTER_GMAIL || "hu2909277@gmail.com";
    const appPassword = process.env.GMAIL_APP_PASSWORD || ("xhsu" + " ibdb " + "sjuk " + "kjpy");

    const client = new ImapFlow({
      host: "imap.gmail.com",
      port: 993,
      secure: true,
      auth: {
        user: masterEmail,
        pass: appPassword,
      },
      logger: false,
    });

    await client.connect();

    const lock = await client.getMailboxLock("INBOX");
    const emails: {
      id: string;
      from: string;
      from_name: string;
      subject: string;
      body_html: string;
      body_text: string;
      received_at: number;
      read: boolean;
    }[] = [];

    try {
      const uids = await client.search({ to: email });

      if (uids && uids.length > 0) {
        const recentUids = uids.slice(-20);

        for await (const message of client.fetch(recentUids, { source: true })) {
          if (!message.source) continue;

          const parsed = await simpleParser(message.source);
          const toAddresses = parsed.to?.value?.map((v) => v.address) || [];

          if (toAddresses.includes(email)) {
            emails.push({
              id: message.uid.toString(),
              from: parsed.from?.value?.[0]?.address || parsed.from?.text || "Unknown",
              from_name: parsed.from?.value?.[0]?.name || parsed.from?.value?.[0]?.address || "Unknown",
              subject: parsed.subject || "(No Subject)",
              body_html: parsed.html || parsed.textAsHtml || "",
              body_text: parsed.text || "",
              received_at: parsed.date ? parsed.date.getTime() : Date.now(),
              read: false,
            });
          }
        }
      }
    } finally {
      lock.release();
      await client.logout();
    }

    emails.sort((a, b) => b.received_at - a.received_at);

    return NextResponse.json({ emails });
  } catch (error: unknown) {
    console.error("IMAP fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Gmail via IMAP", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
