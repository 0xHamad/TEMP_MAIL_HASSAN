import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email } = body;
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    if (action === "session") {
      // Log session
      const { error } = await supabase.from("analytics_sessions").insert([
        { ip_address: ip, user_agent: userAgent },
      ]);
      if (error) console.error("Session track error:", error.message);
      return NextResponse.json({ success: true });
    }

    if (action === "generate" && email) {
      // Log email generation
      const { error } = await supabase.from("analytics_emails").insert([
        { email_address: email, ip_address: ip },
      ]);
      if (error) console.error("Email track error:", error.message);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
