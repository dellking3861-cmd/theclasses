import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  return profile?.role === "admin" ? user : null;
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const search = searchParams.get("search") || "";
  const branchId = searchParams.get("branch_id") || "";
  const status = searchParams.get("status") || "";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("students")
    .select("*, user:users(*), branch:branches(*), batch:batches(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(`user.full_name.ilike.%${search}%,user.email.ilike.%${search}%,roll_number.ilike.%${search}%`);
  }
  if (branchId) {
    query = query.eq("branch_id", branchId);
  }
  if (status === "active") {
    query = query.eq("is_active", true);
  } else if (status === "inactive") {
    query = query.eq("is_active", false);
  }

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: data as any[],
    total: count || 0,
    page,
    pageSize,
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { email, password, full_name, phone, roll_number, branch_id, batch_id, date_of_birth, gender, address, emergency_contact, grade, board } = body;

  if (!email || !password || !full_name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role: "student" },
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const userId = authData.user.id;

  // Create user profile
  const { error: profileError } = await supabase.from("users").insert({
    id: userId,
    email,
    full_name,
    phone,
    role: "student",
    branch_id: branch_id || null,
    is_active: true,
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }

  // Create student record
  const { data: student, error: studentError } = await supabase
    .from("students")
    .insert({
      user_id: userId,
      roll_number: roll_number || null,
      branch_id: branch_id || null,
      batch_id: batch_id || null,
      date_of_birth: date_of_birth || null,
      gender: gender || null,
      address: address || null,
      emergency_contact: emergency_contact || null,
      grade: grade || null,
      board: board || null,
      is_active: true,
    })
    .select()
    .single();

  if (studentError) {
    await supabase.auth.admin.deleteUser(userId);
    await supabase.from("users").delete().eq("id", userId);
    return NextResponse.json({ error: "Failed to create student record" }, { status: 500 });
  }

  return NextResponse.json({
    message: "Student created successfully",
    student,
  });
}