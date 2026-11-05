/**
 * Google Business Profile data via the Places API (New), server-side only.
 *
 * Uses GMB_API_KEY (a Google Maps Platform key with "Places API (New)"
 * enabled). Responses are cached by Next.js for 6 hours, which keeps the
 * site current while staying well inside Google's free monthly credit.
 * Google's terms require showing reviews with author attribution and a
 * "Google" credit, which the UI does.
 */

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
export async function getBusinessProfile(): Promise<BusinessProfile | null> {
  const key = process.env.GMB_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}`, {
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
