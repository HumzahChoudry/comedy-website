import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getVideos, saveVideos } from "@/lib/data";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const videos = getVideos();
  const updated = videos.filter((v) => v.id !== id);
  saveVideos(updated);

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const videos = getVideos();
  const updated = videos.map((v) => (v.id === id ? { ...v, ...body } : v));
  saveVideos(updated);

  return NextResponse.json({ success: true });
}
