import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const adminCookie = req.headers.get("cookie")?.includes("admin_session=true");
    if (!adminCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = getServiceSupabase();
    
    // Get start of today (UTC)
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    const todayIso = today.toISOString();

    // Fetch unique IPs from sessions
    const { data: sessionData } = await supabase
      .from("analytics_sessions")
      .select("ip_address")
      .gte("created_at", todayIso);

    // Fetch emails generated today
    const { data: emailsData } = await supabase
      .from("analytics_emails")
      .select("id")
      .gte("created_at", todayIso);

    // Calculate stats
    const totalSessions = sessionData?.length || 0;
    const uniqueIps = new Set(sessionData?.map(s => s.ip_address) || []).size;
    const emailsCreatedToday = emailsData?.length || 0;

    return NextResponse.json({
      totalSessions,
      uniqueIps,
      emailsCreatedToday
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
