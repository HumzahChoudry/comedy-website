import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getVideos, saveVideos } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, youtubeUrl, featured } = await req.json();

  if (!title || !youtubeUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const video = {
    id: uuidv4(),
    title,
    description: description || "",
    youtubeUrl,
    thumbnailUrl: "",
    addedAt: new Date().toISOString(),
    featured: !!featured,
  };

  const videos = getVideos();
  saveVideos([video, ...videos]);

  return NextResponse.json({ video });
}
