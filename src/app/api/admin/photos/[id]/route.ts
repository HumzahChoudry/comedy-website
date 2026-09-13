import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPhotos, savePhotos, getBucket } from "@/lib/data";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const photos = await getPhotos();
  const photo = photos.find((p) => p.id === id);

  if (!photo) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  // Delete the object from R2. photo.src looks like "/img/photos/<uuid>.<ext>";
  // strip the "/img/" prefix to get the R2 key.
  try {
    if (photo.src.startsWith("/img/")) {
      const key = photo.src.slice("/img/".length);
      const bucket = await getBucket();
      await bucket.delete(key);
    }
  } catch {
    // Object may not exist in R2, continue.
  }

  const updated = photos.filter((p) => p.id !== id);
  await savePhotos(updated);

  return NextResponse.json({ success: true });
}
