import { NextResponse } from "next/server";
import { supabase, getServiceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase.from("domains").select("domain").order("domain");
    
    if (error) throw error;
    
    const domains = data.map((d: any) => d.domain);
    
    // Fallback if DB is empty
    if (domains.length === 0) {
      return NextResponse.json({
        domains: ["mail.hassanai.xyz", "temp.hassanai.xyz"]
      });
    }

    return NextResponse.json({ domains });
  } catch (err) {
    console.error("Failed to fetch domains:", err);
    return NextResponse.json({ domains: ["mail.hassanai.xyz", "temp.hassanai.xyz"] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { domain, password } = body;

    // Very basic security to prevent abuse since anyone could hit this API.
    // In production, we'd use a real session cookie.
    if (password !== "78651214") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    const serviceClient = getServiceSupabase();
    const { error } = await serviceClient.from("domains").insert([{ domain }]);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: "Domain already exists" }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to add domain:", err);
    return NextResponse.json({ error: "Failed to add domain" }, { status: 500 });
  }
}
