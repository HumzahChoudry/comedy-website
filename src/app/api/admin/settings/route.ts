import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSiteConfig, saveSiteConfig } from "@/lib/data";
export async function GET() {
  // Optionally, you can add auth here if you want to protect the GET route
  const config = getSiteConfig();
  return NextResponse.json({ config });
}
import { SiteConfig } from "@/types";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const config = (await req.json()) as SiteConfig;
    saveSiteConfig(config);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
