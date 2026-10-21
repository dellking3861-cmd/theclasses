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
  const status = searchParams.get("status") || "";
  const courseId = searchParams.get("course_id") || "";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("exams")
    .select("*, course:courses(*), teacher:teachers(*, user:users(*))", { count: "exact" })
    .order("scheduled_at", { ascending: true })
    .range(from, to);

  if (search) {
    query = query.or(`title.ilike.%${search}%`);
  }
  if (courseId) {
    query = query.eq("course_id", courseId);
  }
  if (status === "published") {
    query = query.eq("is_published", true);
  } else if (status === "draft") {
    query = query.eq("is_published", false);
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
  const { course_id, teacher_id, title, description, exam_type, total_marks, passing_marks, duration_minutes, scheduled_at, is_published } = body;

  if (!course_id || !teacher_id || !title || !scheduled_at) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("exams")
    .insert({
      course_id,
      teacher_id,
      title,
      description: description || null,
      exam_type: exam_type || "quiz",
      total_marks: total_marks || 100,
      passing_marks: passing_marks || 40,
      duration_minutes: duration_minutes || 60,
      scheduled_at,
      is_published: is_published || false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Exam created successfully", exam: data });
}