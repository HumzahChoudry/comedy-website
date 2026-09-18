import { NextRequest, NextResponse } from "next/server";
import { addEmailSignup } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      email?: string;
      city?: string;
      state?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const city = body.city?.trim() || "";
    const state = body.state?.trim() || "";

    // Basic email validation.
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const inserted = await addEmailSignup({
      id: uuidv4(),
      email,
      city,
      state,
      createdAt: new Date().toISOString(),
    });

    if (!inserted) {
      // Already subscribed — treat as success so we don't reveal list membership.
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email signup error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
