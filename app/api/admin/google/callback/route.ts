import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import {
  emailFromIdToken,
  exchangeCode,
  getAdminUserId,
  listLocations,
  OAUTH_STATE_COOKIE,
  syncGoogleBusiness,
} from "@/lib/google-oauth";
import { popupResponse } from "@/lib/google-popup";

/** Google redirects here (inside the popup) after the owner approves access. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete({ name: OAUTH_STATE_COOKIE, path: "/api/admin/google" });

  if (url.searchParams.get("error")) {
    return popupResponse(origin, { ok: false, message: "Google sign-in was cancelled." });
  }
  const code = url.searchParams.get("code");
  if (!code || !expectedState || url.searchParams.get("state") !== expectedState) {
    return popupResponse(origin, { ok: false, message: "The sign-in link expired or was invalid. Please try again." });
  }
  if (!(await getAdminUserId())) {
    return popupResponse(origin, { ok: false, message: "Only admins can connect Google Business Profile." });
  }

  const tokens = await exchangeCode(code, origin);
  if (!tokens.refresh_token || !tokens.access_token) {
    return popupResponse(origin, { ok: false, message: tokens.error_description || "Google did not grant offline access. Please try again." });
  }

  const admin = await createAdminClient();
  const now = new Date().toISOString();
  const base = {
    id: 1,
    refresh_token: tokens.refresh_token,
    connected_email: emailFromIdToken(tokens.id_token),
    connected_at: now,
    updated_at: now,
  };

  let locations: Awaited<ReturnType<typeof listLocations>> = [];
  let listError: string | null = null;
  try {
    locations = await listLocations(tokens.access_token);
  } catch (err) {
    listError = err instanceof Error ? err.message : "Could not list your business locations.";
  }

  const only = locations.length === 1 ? locations[0] : null;
  const { error } = await admin.from("google_integration").upsert({
    ...base,
    account_name: only?.account ?? null,
    location_name: only?.location ?? null,
    location_title: only?.title ?? null,
    last_sync_error: listError,
  });
  if (error) return popupResponse(origin, { ok: false, message: `Could not save the connection: ${error.message}` });

  if (listError) return popupResponse(origin, { ok: false, message: `Signed in, but ${listError}` });
  if (!locations.length) return popupResponse(origin, { ok: false, message: "Signed in, but this Google account doesn't manage any business locations." });

  if (only) {
    try {
      const r = await syncGoogleBusiness();
      return popupResponse(origin, { ok: true, message: `Connected to “${only.title}”. Synced ${r.reviews} reviews and ${r.photos} photos.` });
    } catch (err) {
      return popupResponse(origin, { ok: true, message: `Connected to “${only.title}”, but the first sync failed: ${err instanceof Error ? err.message : "unknown error"}` });
    }
  }
  return popupResponse(origin, { ok: true, message: `Connected. Choose which of your ${locations.length} locations to show.` });
}
