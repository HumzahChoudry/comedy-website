import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPhotos, savePhotos, getBucket } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("photos") as File[];
    const caption = (formData.get("caption") as string) || "";

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const bucket = await getBucket();
    const existingPhotos = await getPhotos();
    const newPhotos = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const ext = file.name.split(".").pop() || "jpg";
      const key = `photos/${uuidv4()}.${ext}`;

      // Store the image bytes in R2.
      await bucket.put(key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type },
      });

      newPhotos.push({
        id: uuidv4(),
        // Served by the /img/[...key] route which streams from R2.
        src: `/img/${key}`,
        alt: file.name.replace(/\.[^/.]+$/, ""),
        caption,
        uploadedAt: new Date().toISOString(),
      });
    }

    const updatedPhotos = [...newPhotos, ...existingPhotos];
    await savePhotos(updatedPhotos);

    return NextResponse.json({ photos: newPhotos });
  } catch (err) {
    console.error("Photo upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
