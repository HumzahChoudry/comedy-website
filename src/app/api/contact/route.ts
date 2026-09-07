import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ---------------------------------------------------------------
    // TEMPLATE NOTE: Replace this section with your preferred email
    // service (e.g., Resend, SendGrid, Nodemailer) to actually send
    // the contact form email. The contact info is logged below as
    // a placeholder.
    // ---------------------------------------------------------------
    console.log("📬 New contact form submission:", {
      name,
      email,
      subject,
      message,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
