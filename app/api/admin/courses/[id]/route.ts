import { NextResponse } from "next/server";
import { isValidSelection } from "@/lib/curriculum";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";


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
    .from("courses")
    .select("*, teacher:teachers(*, user:users(*)), branch:branches(*), batch:batches(*)")
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
  const { title, description, course_type, stage, board, group_code, subject, program, teacher_id, branch_id, batch_id, fee_amount, duration_months, max_enrollments, thumbnail_url, is_published, start_date, end_date } = body;

  // Board courses need a real board/level/group/subject combination; programs have none.
  const isBoardCourse = (course_type || "board") === "board";
  if (isBoardCourse && !(board && stage && subject && isValidSelection({ board, stage, group: group_code, subject }))) {
    return NextResponse.json({ error: "Choose a valid level, board, group and subject" }, { status: 400 });
  }
  const curriculum = isBoardCourse
    ? { stage, board, group_code: group_code || null, subject }
    : { stage: null, board: null, group_code: null, subject: null };

  const { data, error } = await supabase
    .from("courses")
    .update({
      title,
      description,
      course_type,
      ...curriculum,
      program,
      teacher_id: teacher_id || null,
      branch_id: branch_id || null,
      batch_id: batch_id || null,
      fee_amount,
      duration_months,
      max_enrollments,
      thumbnail_url,
      is_published,
      start_date,
      end_date,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Course updated successfully", course: data });
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
  const { error } = await supabase.from("courses").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Course deleted successfully" });
}