import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPhotos, savePhotos } from "@/lib/data";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const photos = getPhotos();
  const photo = photos.find((p) => p.id === id);

  if (!photo) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  // Delete file from disk
  try {
    const filepath = path.join(process.cwd(), "public", photo.src);
    await unlink(filepath);
  } catch {
    // File may not exist on disk, continue
  }

  const updated = photos.filter((p) => p.id !== id);
  savePhotos(updated);

  return NextResponse.json({ success: true });
}
