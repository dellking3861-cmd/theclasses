import { NextResponse } from "next/server";
import { isValidSelection } from "@/lib/curriculum";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { setLinks } from "@/lib/links";


export async function GET(request: Request) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  // , ( ) would split or break the PostgREST or() filter below
  const search = (searchParams.get("search") || "").replace(/[,()\s]+/g, " ").trim();
  const branchId = searchParams.get("branch_id") || "";
  const status = searchParams.get("status") || "";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("students")
    .select("*, user:users(*), branch:branches(*), batch:batches(*), enrollments(course_id)", { count: "exact" })
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
  const { email, password, full_name, phone, roll_number, branch_id, batch_id, date_of_birth, gender, address, emergency_contact, grade, board, stage, group_code, course_ids } = body;

  if (!isValidSelection({ board, stage, group: group_code }) || (board && !stage)) {
    return NextResponse.json({ error: "Choose a valid board, level and group" }, { status: 400 });
  }

  if (!email || !password || !full_name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Use admin client for admin operations (bypasses RLS)
  const adminSupabase = await createAdminClient();

  // Create auth user
  const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    // provisioned_by tells the on_auth_user_created trigger to skip: this route creates the
    // profile itself. It must be in user_metadata too, because GoTrue writes app_metadata
    // only after the auth.users row (and so the trigger) has already been inserted.
    user_metadata: { full_name, role: "student", provisioned_by: "admin" },
    app_metadata: { provisioned_by: "admin" },
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const userId = authData.user.id;

  // Create user profile
  const { error: profileError } = await adminSupabase.from("users").upsert({
    id: userId,
    email,
    full_name,
    phone,
    role: "student",
    branch_id: branch_id || null,
    is_active: true,
  });

  if (profileError) {
    await adminSupabase.auth.admin.deleteUser(userId);
    console.error("[admin] create profile failed", profileError);
    return NextResponse.json({ error: `Failed to create profile: ${profileError.message}` }, { status: 500 });
  }

  // Create student record
  const { data: student, error: studentError } = await adminSupabase
    .from("students")
    .upsert(
      {
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
        stage: board ? stage : null,
        group_code: board ? group_code || null : null,
        is_active: true,
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (studentError) {
    await adminSupabase.auth.admin.deleteUser(userId);
    await adminSupabase.from("users").delete().eq("id", userId);
    console.error("[admin] create student record failed", studentError);
    return NextResponse.json({ error: `Failed to create student record: ${studentError.message}` }, { status: 500 });
  }

  const linkError = await setLinks(adminSupabase, "enrollments", "student_id", student.id, "course_id", course_ids);
  if (linkError) return NextResponse.json({ error: `Student created, but enrolling in courses failed: ${linkError}` }, { status: 500 });

  return NextResponse.json({
    message: "Student created successfully",
    student,
  });
}