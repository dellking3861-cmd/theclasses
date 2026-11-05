import { NextResponse } from "next/server";
import { getBusinessProfile } from "@/lib/google-business";

/** Public Google Business Profile summary (rating, reviews, hours, contact). */
export async function GET() {
  const profile = await getBusinessProfile();

  if (!profile) {
    return NextResponse.json(
      { error: "Google Business Profile unavailable", reviews: [], rating: 0, totalReviews: 0 },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      // Kept for existing callers
      name: profile.name,
      rating: profile.rating ?? 0,
      totalReviews: profile.reviewCount,
      reviews: profile.reviews,
      reviewsReturned: profile.reviews.length,
      // Additional profile details
      openingHours: profile.openingHours,
      openNow: profile.openNow,
      phone: profile.phone,
      internationalPhone: profile.internationalPhone,
      address: profile.address,
      mapsUri: profile.mapsUri,
      websiteUri: profile.websiteUri,
      businessStatus: profile.businessStatus,
      description: profile.description,
      category: profile.category,
      diagnostics: profile.diagnostics ?? null,
      photos: profile.photos.map(({ src, width, height, author, authorUri }) => ({ src, width, height, author, authorUri })),
    },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=21600" } }
  );
}
