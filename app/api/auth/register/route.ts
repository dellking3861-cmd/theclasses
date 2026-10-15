import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  const { email, password, full_name, role } = body;

  if (!email || !password || !full_name || !role) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        role,
      },
    },
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  if (authData.user) {
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      email,
      full_name,
      role,
      is_active: true,
    });

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to create profile" },
        { status: 500 }
      );
    }

    if (role === "student") {
      await supabase.from("students").insert({ user_id: authData.user.id });
    } else if (role === "parent") {
      await supabase.from("parents").insert({ user_id: authData.user.id });
    }
  }

  return NextResponse.json({
    message: "Registration successful",
    user: authData.user,
  });
}
