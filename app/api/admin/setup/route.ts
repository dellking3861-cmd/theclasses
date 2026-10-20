import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { email, password, full_name } = body;

  if (!email || !password || !full_name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Supabase credentials not configured" },
      { status: 500 }
    );
  }

  try {
    // Step 1: Create user in Supabase Auth using the Management API
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name, role: "admin" },
      }),
    });

    if (!authResponse.ok) {
      const error = await authResponse.json();
      // If user already exists, try to find them
      if (error.status === 400 && error.message?.includes("already registered")) {
        // User exists, update their role to admin
        return NextResponse.json({
          message: "Admin user already exists",
          email,
          full_name,
        });
      }
      return NextResponse.json({ error: error.message || "Failed to create auth user" }, { status: 400 });
    }

    const authData = await authResponse.json();
    const userId = authData.id;

    // Step 2: Insert into users table using Supabase REST API with service key
    const usersResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        id: userId,
        email,
        full_name,
        role: "admin",
        is_active: true,
      }),
    });

    if (!usersResponse.ok) {
      const error = await usersResponse.json();
      // If already exists, that's fine
      if (error.message?.includes("duplicate key") || usersResponse.status === 409) {
        return NextResponse.json({
          message: "Admin user setup complete (user already exists)",
          user: { id: userId, email, full_name, role: "admin" },
        });
      }
      return NextResponse.json({ error: error.message || "Failed to create profile" }, { status: 500 });
    }

    const userData = await usersResponse.json();

    return NextResponse.json({
      message: "Admin user created successfully",
      user: userData[0] || { id: userId, email, full_name, role: "admin" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}