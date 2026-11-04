import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { enquirySchema } from "@/lib/validations";

// Best-effort per-instance rate limit (serverless instances don't share memory).
// Enough to stop casual spam; use a shared store (e.g. Upstash) for stronger limits.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." },
      { status: 400 }
    );
  }

  const { website, ...enquiry } = parsed.data;

  // Honeypot filled in: pretend success so bots don't retry, but store nothing.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("enquiries").insert({
      kind: enquiry.kind,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone || null,
      subject: enquiry.subject || null,
      message: enquiry.message || "",
      board: enquiry.board || null,
      grade: enquiry.grade || null,
    });

    if (error) {
      console.error("[enquiries] insert failed:", error.message);
      return NextResponse.json(
        { error: "We couldn't send your message. Please call or WhatsApp us instead." },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[enquiries] unexpected error:", err);
    return NextResponse.json(
      { error: "We couldn't send your message. Please call or WhatsApp us instead." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
