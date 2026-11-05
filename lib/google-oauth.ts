/**
 * Google Business Profile (owner) integration: OAuth sign-in, token handling,
 * and syncing reviews and photos into Supabase. Server-side only.
 *
 * Needs GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET (an OAuth
 * "Web application" client whose authorized redirect URI is
 * https://<site>/api/admin/google/callback), and Business Profile API access
 * approved by Google for that Cloud project.
 */
import { createClient, createAdminClient } from "@/lib/supabase/server";

export const GOOGLE_SCOPES = ["openid", "email", "https://www.googleapis.com/auth/business.manage"];
export const OAUTH_STATE_COOKIE = "gbp_oauth_state";

export function oauthConfigured(): boolean {
  return Boolean(process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET);
}

export function redirectUri(origin: string): string {
  return `${origin}/api/admin/google/callback`;
}

/** Returns the signed-in user's id if they are an active admin, else null. */
export async function getAdminUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("users").select("role, is_active").eq("id", user.id).single();
  return data?.role === "admin" && data.is_active ? user.id : null;
}

export function authorizationUrl(origin: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
    redirect_uri: redirectUri(origin),
    response_type: "code",
    scope: GOOGLE_SCOPES.join(" "),
    access_type: "offline", // returns a refresh token for daily syncing
    prompt: "consent select_account",
    include_granted_scopes: "true",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
}

async function tokenRequest(body: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
      ...body,
    }),
    cache: "no-store",
  });
  return (await res.json()) as TokenResponse;
}

export async function exchangeCode(code: string, origin: string) {
  return tokenRequest({ grant_type: "authorization_code", code, redirect_uri: redirectUri(origin) });
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const t = await tokenRequest({ grant_type: "refresh_token", refresh_token: refreshToken });
  if (!t.access_token) throw new Error(t.error_description || t.error || "Google sign-in has expired. Please reconnect.");
  return t.access_token;
}

export async function revokeToken(token: string): Promise<void> {
  await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`, { method: "POST", cache: "no-store" }).catch(() => {});
}

/** Email from the id_token returned directly by Google's token endpoint over TLS. */
export function emailFromIdToken(idToken?: string): string | null {
  if (!idToken) return null;
  try {
    const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64url").toString("utf8"));
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}

async function gbp<T>(url: string, accessToken: string): Promise<T> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (json as { error?: { message?: string; status?: string } }).error;
    if (res.status === 429 || res.status === 403) {
      throw new Error(
        `Google refused the request (${res.status}${msg?.status ? ` ${msg.status}` : ""}). ` +
          "Business Profile API access may not be approved for this Google Cloud project yet. " +
          (msg?.message ?? "")
      );
    }
    throw new Error(msg?.message || `Google API error ${res.status}`);
  }
  return json as T;
}

export interface GbpLocation {
  account: string; // accounts/123
  location: string; // locations/456
  title: string;
  address: string;
}

export async function listLocations(accessToken: string): Promise<GbpLocation[]> {
  const accounts = await gbp<{ accounts?: { name: string }[] }>(
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    accessToken
  );
  const out: GbpLocation[] = [];
  for (const acc of accounts.accounts ?? []) {
    const locs = await gbp<{
      locations?: { name: string; title?: string; storefrontAddress?: { addressLines?: string[]; locality?: string } }[];
    }>(
      `https://mybusinessbusinessinformation.googleapis.com/v1/${acc.name}/locations?readMask=name,title,storefrontAddress&pageSize=100`,
      accessToken
    );
    for (const l of locs.locations ?? []) {
      out.push({
        account: acc.name,
        location: l.name,
        title: l.title ?? "Untitled location",
        address: [...(l.storefrontAddress?.addressLines ?? []), l.storefrontAddress?.locality].filter(Boolean).join(", "),
      });
    }
  }
  return out;
}

const STARS: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

interface V4Review {
  reviewId: string;
  reviewer?: { displayName?: string; profilePhotoUrl?: string; isAnonymous?: boolean };
  starRating?: string;
  comment?: string;
  createTime?: string;
  updateTime?: string;
  reviewReply?: { comment?: string };
}
interface V4Media {
  name: string;
  mediaFormat?: string;
  googleUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  createTime?: string;
  dimensions?: { widthPixels?: number; heightPixels?: number };
  locationAssociation?: { category?: string };
}

/** Google adds "(Translated by Google)" blocks; keep the reviewer's own words. */
function originalComment(comment?: string): string | null {
  if (!comment) return null;
  const m = comment.match(/\(Original\)\s*([\s\S]+)$/);
  return (m ? m[1] : comment.replace(/\(Translated by Google\)[\s\S]*/, "")).trim() || null;
}

/** Pulls all reviews and photos for the connected location into Supabase. */
export async function syncGoogleBusiness(): Promise<{ reviews: number; photos: number }> {
  const admin = await createAdminClient();
  const { data: integ } = await admin.from("google_integration").select("*").eq("id", 1).maybeSingle();
  if (!integ?.refresh_token) throw new Error("Google Business Profile is not connected.");
  if (!integ.account_name || !integ.location_name) throw new Error("Choose which business location to sync.");

  try {
    const token = await refreshAccessToken(integ.refresh_token);
    const parent = `https://mybusiness.googleapis.com/v4/${integ.account_name}/${integ.location_name}`;

    const reviews: V4Review[] = [];
    let pageToken = "";
    for (let i = 0; i < 20; i++) {
      const page = await gbp<{ reviews?: V4Review[]; nextPageToken?: string }>(
        `${parent}/reviews?pageSize=50${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`,
        token
      );
      reviews.push(...(page.reviews ?? []));
      if (!page.nextPageToken) break;
      pageToken = page.nextPageToken;
    }

    const media: V4Media[] = [];
    pageToken = "";
    for (let i = 0; i < 10; i++) {
      const page = await gbp<{ mediaItems?: V4Media[]; nextPageToken?: string }>(
        `${parent}/media?pageSize=100${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`,
        token
      );
      media.push(...(page.mediaItems ?? []));
      if (!page.nextPageToken) break;
      pageToken = page.nextPageToken;
    }
    const photos = media.filter((m) => m.mediaFormat === "PHOTO" && m.googleUrl);

    const now = new Date().toISOString();
    // Replace the synced copies so removed reviews/photos disappear too
    await admin.from("google_reviews").delete().neq("review_id", "");
    if (reviews.length) {
      const { error } = await admin.from("google_reviews").insert(
        reviews
          .filter((r) => STARS[r.starRating ?? ""])
          .map((r) => ({
            review_id: r.reviewId,
            author: r.reviewer?.isAnonymous ? "A Google user" : r.reviewer?.displayName ?? "A Google user",
            author_photo_url: r.reviewer?.isAnonymous ? null : r.reviewer?.profilePhotoUrl ?? null,
            rating: STARS[r.starRating ?? ""],
            comment: originalComment(r.comment),
            reply: r.reviewReply?.comment ?? null,
            create_time: r.createTime ?? null,
            update_time: r.updateTime ?? null,
            synced_at: now,
          }))
      );
      if (error) throw new Error(`Saving reviews failed: ${error.message}`);
    }
    await admin.from("google_media").delete().neq("media_id", "");
    if (photos.length) {
      const { error } = await admin.from("google_media").insert(
        photos.map((m) => ({
          media_id: m.name,
          url: m.googleUrl!,
          thumbnail_url: m.thumbnailUrl ?? null,
          category: m.locationAssociation?.category ?? null,
          description: m.description ?? null,
          width: m.dimensions?.widthPixels ?? null,
          height: m.dimensions?.heightPixels ?? null,
          create_time: m.createTime ?? null,
          synced_at: now,
        }))
      );
      if (error) throw new Error(`Saving photos failed: ${error.message}`);
    }

    await admin.from("google_integration").update({ last_synced_at: now, last_sync_error: null, updated_at: now }).eq("id", 1);
    return { reviews: reviews.length, photos: photos.length };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    await admin.from("google_integration").update({ last_sync_error: message, updated_at: new Date().toISOString() }).eq("id", 1);
    throw err;
  }
}
