import { createClient } from "@/lib/supabase/server";

export interface Child {
  student_id: string;
  full_name: string;
  roll_number: string | null;
}

/** The signed-in parent's linked children (names come from my_children(); RLS covers the rest). */
export async function loadChildren() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("my_children");
  return { supabase, children: (data ?? []) as Child[] };
}
