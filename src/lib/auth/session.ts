import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function requireUser(redirectTo = "/login") {
  const user = await getSession();
  if (!user) redirect(redirectTo);
  return user;
}
