import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json().catch(() => null);

  // Validate on the server: the form only offers student/parent, but the API
  // must enforce it too, otherwise anyone can POST role "admin" or "teacher".
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid registration details" },
      { status: 400 }
    );
  }

  const { email, password, full_name, phone, role } = parsed.data;

  // The profile (users + students/parents row) is created by the
  // on_auth_user_created database trigger, which only accepts student/parent.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, phone: phone || null, role },
      emailRedirectTo: `${appUrl}/login`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    message: "Registration successful. Please check your email to verify your account.",
    needsEmailConfirmation: !data.session,
  });
}
