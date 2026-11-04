import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const STATUSES = ["new", "contacted", "enrolled", "closed"] as const;

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: profile } = await supabase.from("users").select("role, is_active").eq("id", user.id).single();
  if (profile?.role !== "admin" || !profile.is_active) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize")) || 50));
  const from = (page - 1) * pageSize;

  let query = supabase
    .from("enquiries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if ((STATUSES as readonly string[]).includes(status)) {
    query = query.eq("status", status);
  }

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [], total: count ?? 0, page, pageSize });
}
