import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export function isAdmin(user: User): boolean {
  const role =
    user.app_metadata?.role ?? user.user_metadata?.role;
  return role === "admin";
}

export async function requireAdmin(redirectTo = "/admin/login") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user)) {
    redirect(redirectTo);
  }

  return user;
}
