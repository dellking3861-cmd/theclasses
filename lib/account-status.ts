import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

/**
 * PATCH handler body for /api/admin/{students|teachers|parents}/[id]: { is_active: boolean }.
 * Only the status changes (PUT rewrites every field). users.is_active is what locks the
 * login (middleware, login route and every RLS helper check it).
 */
export async function setAccountActive(request: Request, table: "students" | "teachers" | "parents", id: string) {
  const supabase = await createClient();
  if (!(await requireAdmin(supabase))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (typeof body?.is_active !== "boolean") return NextResponse.json({ error: "is_active must be true or false" }, { status: 400 });

  const { data: row } = await supabase.from(table).select("user_id").eq("id", id).maybeSingle();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error } = await supabase.from("users").update({ is_active: body.is_active }).eq("id", row.user_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // students and teachers also keep their own flag, which list pages and filters read
  if (table !== "parents") await supabase.from(table).update({ is_active: body.is_active }).eq("id", id);

  return NextResponse.json({ ok: true, is_active: body.is_active });
}
