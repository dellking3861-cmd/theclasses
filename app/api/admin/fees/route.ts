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
  const studentId = searchParams.get("student_id") || "";
  const status = searchParams.get("status") || "";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("payments")
    .select("*, student:students(*, user:users(*)), course:courses(*)", { count: "exact" })
    .order("due_date", { ascending: true })
    .range(from, to);

  if (search) {
    query = query.or(`student.user.full_name.ilike.%${search}%,receipt_number.ilike.%${search}%`);
  }
  if (studentId) {
    query = query.eq("student_id", studentId);
  }
  if (status) {
    query = query.eq("status", status);
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
  const { student_id, course_id, amount, paid_amount, status, method, due_date, paid_at, receipt_number, notes, created_by } = body;

  if (!student_id || !amount || !due_date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("payments")
    .insert({
      student_id,
      course_id: course_id || null,
      amount,
      paid_amount: paid_amount || 0,
      status: status || "pending",
      method: method || null,
      due_date,
      paid_at: paid_at || null,
      receipt_number: receipt_number || null,
      notes: notes || null,
      created_by: created_by || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Fee record created successfully", fee: data });
}