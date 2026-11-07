import type { SupabaseClient } from "@supabase/supabase-js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Makes a link table hold exactly `ids` for one owner (a student's courses, a
 * parent's children): deletes links no longer listed, adds new ones.
 * `ids === undefined` leaves the links alone. Returns an error message or null.
 */
export async function setLinks(
  db: SupabaseClient,
  table: "enrollments" | "parent_students",
  ownerCol: "student_id" | "parent_id",
  ownerId: string,
  otherCol: "course_id" | "student_id",
  ids: unknown
): Promise<string | null> {
  if (ids === undefined) return null;
  if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string" && UUID.test(id))) return "Invalid selection";
  const keep = [...new Set(ids as string[])];

  let del = db.from(table).delete().eq(ownerCol, ownerId);
  if (keep.length) del = del.not(otherCol, "in", `(${keep.join(",")})`);
  const { error: delError } = await del;
  if (delError) return delError.message;

  if (!keep.length) return null;
  const { error } = await db
    .from(table)
    .upsert(keep.map((id) => ({ [ownerCol]: ownerId, [otherCol]: id })), { onConflict: `${ownerCol},${otherCol}`, ignoreDuplicates: true });
  return error?.message ?? null;
}
