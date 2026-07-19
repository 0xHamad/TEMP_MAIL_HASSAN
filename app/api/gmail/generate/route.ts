import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Gmail integration not configured on this server." },
    { status: 501 }
  );
}
