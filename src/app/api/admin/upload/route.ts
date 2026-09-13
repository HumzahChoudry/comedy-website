import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBucket } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";

// Generic single-image upload. Stores the file in R2 and returns its public
// URL (served by the /img/[...key] route). Unlike the photos upload route, this
// does NOT add the image to the photo gallery — useful for the hero background.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "No valid image provided" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const key = `misc/${uuidv4()}.${ext}`;

    const bucket = await getBucket();
    await bucket.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
    });

    return NextResponse.json({ src: `/img/${key}` });
  } catch (err) {
    console.error("Image upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
