import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, full_name } = body;

  if (!email || !password || !full_name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role: "admin" },
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  if (authData.user) {
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      email,
      full_name,
      role: "admin",
      is_active: true,
    });

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to create profile" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    message: "Admin user created successfully",
    user: authData.user,
  });
}
