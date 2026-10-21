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
  const courseId = searchParams.get("course_id") || "";
  const studentId = searchParams.get("student_id") || "";
  const date = searchParams.get("date") || "";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("attendance")
    .select("*, student:students(*, user:users(*)), course:courses(*)", { count: "exact" })
    .order("date", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(`student.user.full_name.ilike.%${search}%`);
  }
  if (courseId) {
    query = query.eq("course_id", courseId);
  }
  if (studentId) {
    query = query.eq("student_id", studentId);
  }
  if (date) {
    query = query.eq("date", date);
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
  const { student_id, course_id, date, status, marked_by, notes } = body;

  if (!student_id || !course_id || !date || !status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("attendance")
    .insert({
      student_id,
      course_id,
      date,
      status,
      marked_by: marked_by || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Attendance record created successfully", attendance: data });
}