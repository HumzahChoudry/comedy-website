import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPhotos, savePhotos } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

    const uploadDir = path.join(process.cwd(), "public", "uploads", "photos");
    await mkdir(uploadDir, { recursive: true });

    const existingPhotos = getPhotos();
    const newPhotos = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const ext = file.name.split(".").pop() || "jpg";
      const filename = `${uuidv4()}.${ext}`;
      const filepath = path.join(uploadDir, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filepath, buffer);

      newPhotos.push({
        id: uuidv4(),
        src: `/uploads/photos/${filename}`,
        alt: file.name.replace(/\.[^/.]+$/, ""),
        caption,
        uploadedAt: new Date().toISOString(),
      });
    }

    const updatedPhotos = [...newPhotos, ...existingPhotos];
    savePhotos(updatedPhotos);

    return NextResponse.json({ photos: newPhotos });
  } catch (err) {
    console.error("Photo upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
