import { NextResponse } from "next/server";

const PLACE_ID = "ChIJsZ1cXUSVDzkRfX1hn1S0MzA";
const GOOGLE_MAPS_URL = "https://maps.googleapis.com/maps/api/place/details/json";

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GMB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GMB API key not configured", reviews: [] },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(
      `${GOOGLE_MAPS_URL}?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total,name,formatted_address&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    const data = await res.json();

    if (data.status === "REQUEST_DENIED") {
      return NextResponse.json(
        { error: "Google Places API key invalid or quota exceeded", reviews: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({
      rating: data.result?.rating ?? 0,
      totalReviews: data.result?.user_ratings_total ?? 0,
      reviews: (data.result?.reviews ?? []).map((r: any) => ({
        author: r.author_name,
        rating: r.rating,
        text: r.text,
        time: r.time,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews", reviews: [] }, { status: 500 });
  }
}
