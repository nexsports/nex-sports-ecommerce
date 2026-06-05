import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
import type { User } from "@supabase/supabase-js";

export class AdminAuthError extends Response {
  constructor(status: number, message: string) {
    super(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Verify the request comes from an authenticated admin/staff user.
 * Returns the user on success, throws a Response on failure.
 */
export async function assertAdmin(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new AdminAuthError(401, "Não autenticado");
  if (!isAdmin(user)) throw new AdminAuthError(403, "Acesso restrito a administradores");

  return user;
}

export function jsonOk(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function jsonErr(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
