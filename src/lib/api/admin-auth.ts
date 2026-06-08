import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
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

/**
 * Edge-compatible admin assertion. Reads Supabase auth token from request
 * cookies and validates via supabaseAdmin (no Next.js cookies() dependency).
 */
export async function assertAdminFromRequest(req: Request): Promise<User> {
  const cookies = req.headers.get("cookie") ?? "";
  const projectRef = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split(".")[0];

  // Try base64-encoded format first, then legacy
  let accessToken: string | undefined;
  const b64Match = cookies.match(new RegExp(`sb-${projectRef}-auth-token=([^;]+)`));
  if (b64Match) {
    try {
      const decoded = JSON.parse(atob(b64Match[1]));
      accessToken = decoded.access_token;
    } catch { /* fall through */ }
  }
  if (!accessToken) {
    const legacyMatch = cookies.match(/sb-access-token=([^;]+)/);
    if (legacyMatch) accessToken = legacyMatch[1];
  }

  if (!accessToken) throw new AdminAuthError(401, "Não autenticado");

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !user) throw new AdminAuthError(401, "Não autenticado");
  if (!isAdmin(user)) throw new AdminAuthError(403, "Acesso restrito a administradores");

  return user;
}

export function jsonOk(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function jsonErr(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
