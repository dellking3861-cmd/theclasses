import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { setAccountActive } from "@/lib/account-status";


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
  const { full_name, phone, employee_id, branch_id, specialization, qualification, experience_years, bio, hire_date, salary, is_active } = body;

  const { data, error } = await supabase
    .from("teachers")
    .update({
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

  // name and phone live on users, not on the teachers table
  if (phone !== undefined || full_name) {
    const { error: phoneError } = await supabase.from("users").update({ ...(full_name ? { full_name } : {}), ...(phone !== undefined ? { phone: phone || null } : {}) }).eq("id", data.user_id);
    if (phoneError) return NextResponse.json({ error: phoneError.message }, { status: 500 });
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
    // Deleting the login cascades to users, teachers and parent links
    const adminSupabase = await createAdminClient();
    const { error } = await adminSupabase.auth.admin.deleteUser(teacher.user_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Teacher deleted successfully" });
}
/** Activate or deactivate the account; only the status changes. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return setAccountActive(request, "teachers", (await params).id);
}
