import { createClient } from "@/lib/supabase/server";
import { RESOURCE_COLUMNS, type StudyResource } from "@/lib/study-resources";
import type { StudentProfile } from "@/components/resources/student-library";

/** Published materials visible to the signed-in student (RLS decides), plus their class. */
export async function loadStudentResources(userId: string, kind: "lectures" | "files") {
  const supabase = await createClient();
  const base = supabase.from("study_resources").select(RESOURCE_COLUMNS).eq("is_published", true);
  const [{ data: student }, { data: items }] = await Promise.all([
    supabase.from("students").select("stage, board, group_code").eq("user_id", userId).maybeSingle(),
    (kind === "lectures" ? base.eq("kind", "lecture") : base.neq("kind", "lecture"))
      .order("created_at", { ascending: false })
      .limit(500),
  ]);
  return {
    profile: (student as StudentProfile | null) ?? null,
    items: (items ?? []) as StudyResource[],
  };
}
