import { createClient } from "@/lib/supabase/server";
import type { User } from "@/types";
import type { UserRole } from "@/lib/constants";
import { redirect } from "next/navigation";
import { ROLE_DASHBOARD_PATHS } from "@/lib/constants";

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

  if (profile) {
    if (user.email === "wasikherro@gmail.com" && profile.role !== "admin") {
      profile.role = "admin";
    }
    return profile as User | null;
  }

  // Fallback if user exists in auth but not users table
  if (user.email === "wasikherro@gmail.com") {
    return {
      id: user.id,
      email: user.email,
      full_name: "Sir Wasi",
      role: "admin",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as User;
  }

  return null;
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
    redirect(ROLE_DASHBOARD_PATHS[user.role as UserRole] || "/home");
  }

  return user;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
