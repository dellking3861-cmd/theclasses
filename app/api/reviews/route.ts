import { NextResponse } from "next/server";

const PLACE_ID = "ChIJsZ1cXUSVDzkRfX1hn1S0MzA";

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
      `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=name,rating,user_ratings_total,reviews &key=${apiKey}`,
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
      name: data.name,
      rating: data.rating ?? 0,
      totalReviews: data.user_ratings_total ?? 0,
      reviews: (data.reviews ?? []).map((r: any) => ({
        author: r.author_name,
        rating: r.rating,
        text: r.text,
        time: r.publish_time,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews", reviews: [], rating: 0, totalReviews: 0 }, { status: 500 });
  }
}
