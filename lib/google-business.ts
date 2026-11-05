/**
 * Google Business Profile data via the Places API (New), server-side only.
 *
 * Uses GMB_API_KEY (a Google Maps Platform key with "Places API (New)"
 * enabled). Responses are cached by Next.js for 6 hours, which keeps the
 * site current while staying well inside Google's free monthly credit.
 * Google's terms require showing reviews with author attribution and a
 * "Google" credit, which the UI does.
 */

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const GOOGLE_PLACE_ID = "ChIJ0cltXEQ7sz4RfP0TVsb4el4";
const REVALIDATE_SECONDS = 6 * 60 * 60;

const FIELD_MASK = [
  "displayName",
  "rating",
  "userRatingCount",
  "reviews",
  "regularOpeningHours",
  "nationalPhoneNumber",
  "internationalPhoneNumber",
  "formattedAddress",
  "googleMapsUri",
  "websiteUri",
  "businessStatus",
  "photos",
  "editorialSummary",
  "primaryTypeDisplayName",
].join(",");

export interface GoogleReview {
  author: string;
  authorUri: string | null;
  authorPhotoUri: string | null;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string | null;
  reviewUri: string | null;
}

export interface GooglePhoto {
  /** Places photo resource name, e.g. places/<id>/photos/<ref> */
  name: string;
  width: number;
  height: number;
  /** Same-origin URL served by /api/google-photo (keeps the API key server-side) */
  src: string;
  author: string | null;
  authorUri: string | null;
}

export interface BusinessProfile {
  name: string;
  rating: number | null;
  reviewCount: number;
  reviews: GoogleReview[];
  openingHours: string[];
  openNow: boolean | null;
  phone: string | null;
  internationalPhone: string | null;
  address: string | null;
  mapsUri: string | null;
  websiteUri: string | null;
  businessStatus: string | null;
  photos: GooglePhoto[];
  description: string | null;
  category: string | null;
}

/* Shapes returned by the Places API (New); only the fields we request. */
interface PlacesReview {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
  googleMapsUri?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
}
interface PlacesResponse {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  reviews?: PlacesReview[];
  regularOpeningHours?: { openNow?: boolean; weekdayDescriptions?: string[] };
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  formattedAddress?: string;
  googleMapsUri?: string;
  websiteUri?: string;
  businessStatus?: string;
  photos?: {
    name?: string;
    widthPx?: number;
    heightPx?: number;
    authorAttributions?: { displayName?: string; uri?: string }[];
  }[];
  editorialSummary?: { text?: string };
  primaryTypeDisplayName?: { text?: string };
}

/** Only photo names belonging to our own listing may be proxied. */
export function isOwnPhotoName(name: string): boolean {
  return name.startsWith(`places/${GOOGLE_PLACE_ID}/photos/`) && /^[A-Za-z0-9_\-/]+$/.test(name) && name.length < 1000;
}

export function photoSrc(name: string, width = 1200): string {
  return `/api/google-photo?name=${encodeURIComponent(name)}&w=${width}`;
}

export function reviewsPageUrl(): string {
  return `https://search.google.com/local/reviews?placeid=${GOOGLE_PLACE_ID}`;
}

/** Returns null when the key is missing or Google is unreachable; callers fall back. */
async function getPlacesProfile(): Promise<BusinessProfile | null> {
  const key = process.env.GMB_API_KEY;
  if (!key) return null;

  try {
    // languageCode/regionCode also make the URL (the cache key) change with the field mask
    const res = await fetch(`https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}?languageCode=en&regionCode=PK`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": FIELD_MASK },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.error("[google-business] Places API error", res.status);
      return null;
    }
    const d = (await res.json()) as PlacesResponse;

    return {
      name: d.displayName?.text ?? "The Classes",
      rating: typeof d.rating === "number" ? d.rating : null,
      reviewCount: d.userRatingCount ?? 0,
      reviews: (d.reviews ?? [])
        .map((r) => ({
          author: r.authorAttribution?.displayName ?? "Google user",
          authorUri: r.authorAttribution?.uri ?? null,
          authorPhotoUri: r.authorAttribution?.photoUri ?? null,
          rating: r.rating ?? 0,
          text: (r.originalText?.text ?? r.text?.text ?? "").trim(),
          relativeTime: r.relativePublishTimeDescription ?? "",
          publishTime: r.publishTime ?? null,
          reviewUri: r.googleMapsUri ?? null,
        }))
        // Reviews with written text first; star-only reviews are kept after them
        .sort((a, b) => Number(b.text.length > 0) - Number(a.text.length > 0)),
      openingHours: d.regularOpeningHours?.weekdayDescriptions ?? [],
      openNow: d.regularOpeningHours?.openNow ?? null,
      phone: d.nationalPhoneNumber ?? null,
      internationalPhone: d.internationalPhoneNumber ?? null,
      address: d.formattedAddress ?? null,
      mapsUri: d.googleMapsUri ?? null,
      websiteUri: d.websiteUri ?? null,
      businessStatus: d.businessStatus ?? null,
      photos: (d.photos ?? [])
        .filter((p): p is typeof p & { name: string } => typeof p.name === "string" && isOwnPhotoName(p.name))
        .map((p) => ({
          name: p.name,
          width: p.widthPx ?? 0,
          height: p.heightPx ?? 0,
          src: photoSrc(p.name),
          author: p.authorAttributions?.[0]?.displayName ?? null,
          authorUri: p.authorAttributions?.[0]?.uri ?? null,
        })),
      description: d.editorialSummary?.text ?? null,
      category: d.primaryTypeDisplayName?.text ?? null,
    };
  } catch (err) {
    console.error("[google-business] fetch failed", err);
    return null;
  }
}

interface SyncedReviewRow {
  review_id: string;
  author: string;
  author_photo_url: string | null;
  rating: number;
  comment: string | null;
  create_time: string | null;
}
interface SyncedMediaRow {
  media_id: string;
  url: string;
  width: number | null;
  height: number | null;
  description: string | null;
}

/** Reviews and photos synced from the owner's Business Profile (see lib/google-oauth.ts). */
async function getSyncedData(): Promise<{ reviews: GoogleReview[]; photos: GooglePhoto[] } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  try {
    const db = createSupabaseClient(url, anonKey, { auth: { persistSession: false } });
    const [reviewsRes, mediaRes] = await Promise.all([
      db.from("google_reviews").select("review_id, author, author_photo_url, rating, comment, create_time").order("create_time", { ascending: false }).limit(50),
      db.from("google_media").select("media_id, url, width, height, description").order("create_time", { ascending: false }).limit(24),
    ]);
    if (reviewsRes.error || mediaRes.error) return null;
    const relative = (iso: string | null) => {
      if (!iso) return "";
      const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
      if (days < 1) return "today";
      if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
      const months = Math.floor(days / 30);
      if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
      const years = Math.floor(months / 12);
      return `${years} year${years === 1 ? "" : "s"} ago`;
    };
    return {
      reviews: ((reviewsRes.data ?? []) as SyncedReviewRow[])
        .map((r) => ({
          author: r.author,
          authorUri: null,
          authorPhotoUri: r.author_photo_url,
          rating: r.rating,
          text: r.comment ?? "",
          relativeTime: relative(r.create_time),
          publishTime: r.create_time,
          reviewUri: null,
        }))
        .sort((a, b) => Number(b.text.length > 0) - Number(a.text.length > 0)),
      photos: ((mediaRes.data ?? []) as SyncedMediaRow[]).map((m) => ({
        name: m.media_id,
        width: m.width ?? 0,
        height: m.height ?? 0,
        src: m.url,
        author: null,
        authorUri: null,
      })),
    };
  } catch {
    return null;
  }
}

/**
 * Public listing details from the Places API, with the owner's synced reviews
 * and photos (when Google Business Profile is connected) taking priority.
 */
export async function getBusinessProfile(): Promise<BusinessProfile | null> {
  const [places, synced] = await Promise.all([getPlacesProfile(), getSyncedData()]);
  if (!places && !synced) return null;
  const base: BusinessProfile = places ?? {
    name: "The Classes",
    rating: null,
    reviewCount: 0,
    reviews: [],
    openingHours: [],
    openNow: null,
    phone: null,
    internationalPhone: null,
    address: null,
    mapsUri: null,
    websiteUri: null,
    businessStatus: null,
    photos: [],
    description: null,
    category: null,
  };
  if (synced?.reviews.length) {
    base.reviews = synced.reviews;
    if (base.rating === null) {
      base.rating = Math.round((synced.reviews.reduce((s, r) => s + r.rating, 0) / synced.reviews.length) * 10) / 10;
      base.reviewCount = synced.reviews.length;
    }
  }
  if (synced?.photos.length) base.photos = synced.photos;
  return base;
}
