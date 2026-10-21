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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const { data, error } = await supabase
    .from("teachers")
    .select("*, user:users(*), branch:branches(*)")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { phone, employee_id, branch_id, specialization, qualification, experience_years, bio, hire_date, salary, is_active } = body;

  const { data, error } = await supabase
    .from("teachers")
    .update({
      phone,
      employee_id,
      branch_id: branch_id || null,
      specialization: specialization || [],
      qualification: qualification || null,
      experience_years: experience_years || 0,
      bio: bio || null,
      hire_date: hire_date || null,
      salary: salary || null,
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Teacher updated successfully", teacher: data });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const { data: teacher } = await supabase
    .from("teachers")
    .select("user_id")
    .eq("id", id)
    .single();

  if (teacher) {
    await supabase.from("teachers").delete().eq("id", id);
    await supabase.from("users").delete().eq("id", teacher.user_id);
    await supabase.auth.admin.deleteUser(teacher.user_id);
  }

  return NextResponse.json({ message: "Teacher deleted successfully" });
}