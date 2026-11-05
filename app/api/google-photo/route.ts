import { NextResponse } from "next/server";
import { isOwnPhotoName } from "@/lib/google-business";

/**
 * Serves photos from the academy's Google listing without exposing the API key.
 * Only photo names that belong to our own place are accepted.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") ?? "";
  const width = Math.min(1600, Math.max(200, Number(searchParams.get("w")) || 1200));
  const key = process.env.GMB_API_KEY;

  if (!key || !isOwnPhotoName(name)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const res = await fetch(`https://places.googleapis.com/v1/${name}/media?maxWidthPx=${width}`, {
    headers: { "X-Goog-Api-Key": key },
    // Follows Google's redirect to the image itself
    redirect: "follow",
  });
  if (!res.ok || !res.headers.get("content-type")?.startsWith("image/")) {
    return NextResponse.json({ error: "Photo unavailable" }, { status: 502 });
  }

  return new NextResponse(res.body, {
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
      // Short-term caching for speed; the listing is re-read every few hours
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
