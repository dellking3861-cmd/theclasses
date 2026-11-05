import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getAdminUserId, listLocations, oauthConfigured, refreshAccessToken, revokeToken, syncGoogleBusiness } from "@/lib/google-oauth";

/** Connection status (never returns the token). ?locations=1 also lists the account's locations. */
export async function GET(request: Request) {
  if (!(await getAdminUserId())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const admin = await createAdminClient();
  const { data } = await admin.from("google_integration").select("*").eq("id", 1).maybeSingle();
  const [{ count: reviewCount }, { count: photoCount }] = await Promise.all([
    admin.from("google_reviews").select("*", { count: "exact", head: true }),
    admin.from("google_media").select("*", { count: "exact", head: true }),
  ]);

  let locations = null;
  let locationsError = null;
  if (new URL(request.url).searchParams.get("locations") && data?.refresh_token) {
    try {
      locations = await listLocations(await refreshAccessToken(data.refresh_token));
    } catch (err) {
      locationsError = err instanceof Error ? err.message : "Could not list locations";
    }
  }

  return NextResponse.json({
    configured: oauthConfigured(),
    connected: Boolean(data?.refresh_token),
    email: data?.connected_email ?? null,
    location: data?.location_name ? { account: data.account_name, location: data.location_name, title: data.location_title } : null,
    connectedAt: data?.connected_at ?? null,
    lastSyncedAt: data?.last_synced_at ?? null,
    lastSyncError: data?.last_sync_error ?? null,
    reviewCount: reviewCount ?? 0,
    photoCount: photoCount ?? 0,
    locations,
    locationsError,
  });
}

/** { action: "sync" } or { action: "select", account, location, title } */
export async function POST(request: Request) {
  if (!(await getAdminUserId())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as { action?: string; account?: string; location?: string; title?: string };
  const admin = await createAdminClient();

  if (body.action === "select") {
    if (!/^accounts\/\d+$/.test(body.account ?? "") || !/^locations\/\d+$/.test(body.location ?? "")) {
      return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }
    await admin.from("google_integration").update({
      account_name: body.account,
      location_name: body.location,
      location_title: (body.title ?? "").slice(0, 200),
      updated_at: new Date().toISOString(),
    }).eq("id", 1);
  } else if (body.action !== "sync") {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  try {
    const result = await syncGoogleBusiness();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Sync failed" }, { status: 502 });
  }
}

/** Disconnect: revokes Google access and removes the synced copies. */
export async function DELETE() {
  if (!(await getAdminUserId())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const admin = await createAdminClient();
  const { data } = await admin.from("google_integration").select("refresh_token").eq("id", 1).maybeSingle();
  if (data?.refresh_token) await revokeToken(data.refresh_token);
  await admin.from("google_integration").delete().eq("id", 1);
  await admin.from("google_reviews").delete().neq("review_id", "");
  await admin.from("google_media").delete().neq("media_id", "");
  return NextResponse.json({ ok: true });
}
