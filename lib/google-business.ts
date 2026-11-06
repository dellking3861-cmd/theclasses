/**
 * Public Google listing details (rating, review count, hours) via the
 * Places API (New), server-side only. Uses GMB_API_KEY (a Google Maps
 * Platform key with "Places API (New)" enabled). Next.js caches the response
 * for 6 hours, which keeps the site current within Google's free credit.
 */

export const GOOGLE_PLACE_ID = "ChIJ0cltXEQ7sz4RfP0TVsb4el4";
const REVALIDATE_SECONDS = 6 * 60 * 60;
const FIELD_MASK = "rating,userRatingCount,regularOpeningHours,googleMapsUri";

export interface BusinessProfile {
  rating: number | null;
  reviewCount: number;
  openingHours: string[];
  mapsUri: string | null;
}

interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
  regularOpeningHours?: { weekdayDescriptions?: string[] };
  googleMapsUri?: string;
}

/** Returns null when the key is missing or Google is unreachable; callers fall back. */
export async function getBusinessProfile(): Promise<BusinessProfile | null> {
  const key = process.env.GMB_API_KEY;
  if (!key) return null;

  try {
    // The field mask goes in the URL (not a header) so Next's fetch cache,
    // which is keyed by URL, can never serve a response for a different mask.
    const query = new URLSearchParams({ fields: FIELD_MASK, languageCode: "en", regionCode: "PK" });
    const res = await fetch(`https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}?${query}`, {
      headers: { "X-Goog-Api-Key": key },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.error("[google-business] Places API error", res.status);
      return null;
    }
    const d = (await res.json()) as PlacesResponse;
    return {
      rating: typeof d.rating === "number" ? d.rating : null,
      reviewCount: d.userRatingCount ?? 0,
      openingHours: d.regularOpeningHours?.weekdayDescriptions ?? [],
      mapsUri: d.googleMapsUri ?? null,
    };
  } catch (err) {
    console.error("[google-business] fetch failed", err);
    return null;
  }
}

/** Compresses "Monday: 4:00 – 8:30 PM" ×6 into "Monday – Saturday: 4:00 – 8:30 PM". */
export function compactHours(lines: string[]): string[] {
  const parsed = lines.map((l) => {
    const i = l.indexOf(":");
    return { day: l.slice(0, i), time: l.slice(i + 1).trim() };
  });
  const out: string[] = [];
  for (let i = 0; i < parsed.length; ) {
    let j = i;
    while (j + 1 < parsed.length && parsed[j + 1].time === parsed[i].time) j++;
    out.push(`${parsed[i].day}${j > i ? ` – ${parsed[j].day}` : ""}: ${parsed[i].time}`);
    i = j + 1;
  }
  return out;
}
