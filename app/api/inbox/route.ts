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
    const emails = JSON.parse(fileContent);

    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Inbox fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
