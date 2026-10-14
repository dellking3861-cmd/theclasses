import { NextResponse } from "next/server";

const PLACE_ID = "ChIJ0cltXEQ7sz4RfP0TVsb4el4";

export async function GET() {
  const apiKey = process.env.GMB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GMB API key not configured", reviews: [], rating: 0, totalReviews: 0 },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=displayName,rating,userRatingCount&key=${apiKey}`,
      {
        headers: { "X-Goog-Api-Key": apiKey },
        next: { revalidate: 3600 },
      }
    );

    const data = await res.json();

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message, reviews: [], rating: 0, totalReviews: 0 },
        { status: 500 }
      );
    }

    return NextResponse.json({
      name: data.displayName?.text ?? "The Classes",
      rating: data.rating ?? 0,
      totalReviews: data.userRatingCount ?? 0,
      reviews: [],
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews", reviews: [], rating: 0, totalReviews: 0 }, { status: 500 });
  }
}
