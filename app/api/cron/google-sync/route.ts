import { NextResponse } from "next/server";
import { syncGoogleBusiness } from "@/lib/google-oauth";

/** Daily Vercel Cron job: refreshes reviews and photos. Requires CRON_SECRET. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json({ ok: true, ...(await syncGoogleBusiness()) });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Sync failed" }, { status: 500 });
  }
}
