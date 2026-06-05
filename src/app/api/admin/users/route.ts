import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";
import { auditLog } from "@/lib/auth/audit";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(120),
  role: z.enum(["staff", "admin"]),
});

export async function GET() {
  await assertAdmin();

  // List users with admin/staff role from Supabase Auth
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    perPage: 100,
  });

  if (error) return jsonErr(error.message, 500);

  const staffUsers = data.users
    .filter((u) => {
      const role = u.app_metadata?.role ?? u.user_metadata?.role;
      return role === "admin" || role === "staff";
    })
    .map((u) => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name ?? null,
      role: u.app_metadata?.role ?? u.user_metadata?.role,
      createdAt: u.created_at,
      lastSignIn: u.last_sign_in_at,
    }));

  return jsonOk(staffUsers);
}

export async function POST(req: Request) {
  const user = await assertAdmin();
  const body = await req.json();
  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) return jsonErr(parsed.error.issues[0].message);

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { name: parsed.data.name, role: parsed.data.role },
    app_metadata: { role: parsed.data.role },
  });

  if (error) return jsonErr(error.message, 500);

  await auditLog({ userId: user.id, action: "create", entity: "user", entityId: data.user.id });

  return jsonOk({
    id: data.user.id,
    email: data.user.email,
    name: parsed.data.name,
    role: parsed.data.role,
  }, 201);
}
