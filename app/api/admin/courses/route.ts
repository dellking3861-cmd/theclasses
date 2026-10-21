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
  const branchId = searchParams.get("branch_id") || "";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("courses")
    .select("*, teacher:teachers(*, user:users(*)), branch:branches(*), batch:batches(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%`);
  }
  if (branchId) {
    query = query.eq("branch_id", branchId);
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
  const { title, slug, description, course_type, board, subject, program, teacher_id, branch_id, batch_id, fee_amount, duration_months, max_enrollments, thumbnail_url, is_published, start_date, end_date } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("courses")
    .insert({
      title,
      slug,
      description: description || null,
      course_type: course_type || "board",
      board: board || null,
      subject: subject || null,
      program: program || null,
      teacher_id: teacher_id || null,
      branch_id: branch_id || null,
      batch_id: batch_id || null,
      fee_amount: fee_amount || 0,
      duration_months: duration_months || 12,
      max_enrollments: max_enrollments || 50,
      thumbnail_url: thumbnail_url || null,
      is_published: is_published || false,
      start_date: start_date || null,
      end_date: end_date || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Course created successfully", course: data });
}