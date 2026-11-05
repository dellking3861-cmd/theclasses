import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseYouTubeId, youtubeWatchUrl } from "@/lib/study-resources";

/** Title and channel for a YouTube video, so staff don't have to type them. Staff only. */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: isStaff } = await supabase.rpc("is_staff");
  if (!isStaff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = parseYouTubeId(new URL(request.url).searchParams.get("url") ?? "");
  if (!id) return NextResponse.json({ error: "That doesn't look like a YouTube link" }, { status: 400 });

  try {
    const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(youtubeWatchUrl(id))}`, {
      next: { revalidate: 86400 },
    });
    if (res.status === 401 || res.status === 403) {
      return NextResponse.json({ error: "This video is private or can't be embedded. Set it to Public or Unlisted and allow embedding." }, { status: 422 });
    }
    if (!res.ok) return NextResponse.json({ error: "Video not found" }, { status: 404 });
    const d = (await res.json()) as { title?: string; author_name?: string };
    return NextResponse.json({ id, title: d.title ?? "", channel: d.author_name ?? "" });
  } catch {
    return NextResponse.json({ id, title: "", channel: "" });
  }
}
