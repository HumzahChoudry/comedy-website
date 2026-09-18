import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getSiteConfig } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { env } = await getCloudflareContext({ async: true });
    const apiKey = env.RESEND_API_KEY;
    const fromEmail = env.RESEND_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
      console.error("Contact form not configured: missing RESEND_API_KEY or RESEND_FROM_EMAIL");
      return NextResponse.json(
        { error: "Contact form is not configured yet." },
        { status: 500 }
      );
    }

    // Send to the site owner's configured contact email.
    const config = await getSiteConfig();
    const toEmail = config.contactEmail;

    const subjectLine = subject
      ? `[Website Contact] ${subject}`
      : `[Website Contact] New message from ${name}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: subjectLine,
        text:
          `New contact form submission:\n\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n` +
          `Subject: ${subject || "(none)"}\n\n` +
          `Message:\n${message}\n`,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend API error:", res.status, errText);
      return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
