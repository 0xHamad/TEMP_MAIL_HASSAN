import { createClient } from "@supabase/supabase-js";

// Ensure we have fallbacks for the keys provided by the user in case env vars fail on the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ecsoklgrrpewnjaajbbh.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjc29rbGdycnBld25qYWFqYmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NjUwNTEsImV4cCI6MjEwMDA0MTA1MX0.WRL2FOMOx7x4ui4puMFnDQkAkdeHaPPXY85hbOQJp_8";

// Client for frontend and anonymous operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-only client for admin/tracking operations to bypass RLS
export function getServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjc29rbGdycnBld25qYWFqYmJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDQ2NTA1MSwiZXhwIjoyMTAwMDQxMDUxfQ.q15C-I-gxj_KPO9wRateAdZVZBJly3HQ6aXD-n2ce64";
  return createClient(supabaseUrl, serviceKey);
}
