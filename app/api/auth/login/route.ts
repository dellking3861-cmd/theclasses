import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, email, full_name, role, is_active")
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "User profile not found" },
      { status: 404 }
    );
  }

  if (!profile.is_active) {
    return NextResponse.json(
      { error: "Account has been deactivated" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: "Login successful",
    user: {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role,
    },
  });
}
