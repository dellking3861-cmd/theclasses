import { createClient } from "@/lib/supabase/server";
import type { User } from "@/types";
import type { UserRole } from "@/lib/constants";
import { redirect } from "next/navigation";

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Role comes only from the database. No email-based overrides.
  return (profile as User | null) ?? null;
}


export async function requireAuth(requiredRole?: UserRole): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.is_active) {
    redirect("/login?error=inactive");
  }

  if (requiredRole && user.role !== requiredRole) {
    // If the user tries to access a page meant for another role, send them to their own dashboard.
    redirect(`/dashboard/${user.role}`);
  }

  return user;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/** API guard: true only for an active admin (the database's is_admin() also checks is_active). */
export async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>): Promise<boolean> {
  const { data } = await supabase.rpc("is_admin");
  return data === true;
}
