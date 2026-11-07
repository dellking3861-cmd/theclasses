import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { enquirySchema } from "@/lib/validations";
import { isValidSelection } from "@/lib/curriculum";
import { clientIp, rateLimiter } from "@/lib/rate-limit";

const rateLimited = rateLimiter(5, 10 * 60 * 1000);

export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
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

  // Board/level/group/subject must be a real combination from the catalog.
  // The Contact form sends no board, and its "subject" is free text.
  const picked = enquiry.board || enquiry.stage || enquiry.group_code;
  if (picked && !isValidSelection({ board: enquiry.board, stage: enquiry.stage, group: enquiry.group_code, subject: enquiry.board ? enquiry.subject : undefined })) {
    return NextResponse.json({ error: "Please choose a valid level, board and group." }, { status: 400 });
  }

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
      stage: enquiry.stage || null,
      group_code: enquiry.group_code || null,
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
