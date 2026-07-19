import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const masterEmail = process.env.MASTER_GMAIL || "hu2909277@gmail.com";
    const [username, domain] = masterEmail.split("@");

    if (!username || !domain || domain !== "gmail.com") {
      return NextResponse.json({ error: "Invalid MASTER_GMAIL format" }, { status: 500 });
    }

    const cleanUser = username.replace(/\./g, "");
    let alias = "";

    if (Math.random() > 0.5 && cleanUser.length > 1) {
      // Dot trick — insert dots at random positions
      alias = cleanUser[0];
      for (let i = 1; i < cleanUser.length; i++) {
        if (Math.random() > 0.5) alias += ".";
        alias += cleanUser[i];
      }
    } else {
      // Plus trick — append random tag
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      const tag = Array.from({ length: 6 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join("");
      alias = `${cleanUser}+${tag}`;
    }

    return NextResponse.json({ email: `${alias}@gmail.com` });
  } catch (err) {
    console.error("Gmail generate error:", err);
    return NextResponse.json({ error: "Failed to generate alias" }, { status: 500 });
  }
}
