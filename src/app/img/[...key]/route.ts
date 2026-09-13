import { NextRequest, NextResponse } from "next/server";
import { getBucket } from "@/lib/data";

// Serves images stored in R2. Uploaded images have src like "/img/photos/<id>.jpg";
// this route maps that path back to the R2 object key and streams it.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key: keyParts } = await params;
  const key = keyParts.join("/");

  const bucket = await getBucket();
  const object = await bucket.get(key);

  if (!object) {
    return new NextResponse("Not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  // Cache aggressively — image keys are unique (UUIDs), so they never change.
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new NextResponse(object.body as ReadableStream, { headers });
}
