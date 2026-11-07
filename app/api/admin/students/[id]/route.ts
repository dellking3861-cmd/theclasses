import { NextResponse } from "next/server";
import { isValidSelection } from "@/lib/curriculum";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { setLinks } from "@/lib/links";


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
    .from("students")
    .select("*, user:users(*), branch:branches(*), batch:batches(*)")
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
  const { full_name, phone, roll_number, branch_id, batch_id, date_of_birth, gender, address, emergency_contact, grade, board, stage, group_code, is_active, course_ids } = body;

  if (!isValidSelection({ board, stage, group: group_code }) || (board && !stage)) {
    return NextResponse.json({ error: "Choose a valid board, level and group" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("students")
    .update({
      roll_number,
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
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // name and phone live on users, not on the students table
  if (phone !== undefined || full_name) {
    const { error: phoneError } = await supabase.from("users").update({ ...(full_name ? { full_name } : {}), ...(phone !== undefined ? { phone: phone || null } : {}) }).eq("id", data.user_id);
    if (phoneError) return NextResponse.json({ error: phoneError.message }, { status: 500 });
  }

  const linkError = await setLinks(supabase, "enrollments", "student_id", id, "course_id", course_ids);
  if (linkError) return NextResponse.json({ error: `Saved, but updating courses failed: ${linkError}` }, { status: 500 });

  return NextResponse.json({ message: "Student updated successfully", student: data });
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

  const { data: student } = await supabase
    .from("students")
    .select("user_id")
    .eq("id", id)
    .single();

  if (student) {
    // Deleting the login cascades to users, students and parent links
    const adminSupabase = await createAdminClient();
    const { error } = await adminSupabase.auth.admin.deleteUser(student.user_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Student deleted successfully" });
}