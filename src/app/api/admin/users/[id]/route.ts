import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";
import { auditLog } from "@/lib/auth/audit";

const updateUserSchema = z.object({
  role: z.enum(["staff", "admin"]),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const user = await assertAdmin();
  const { id } = await params;
  const body = await req.json();
  const parsed = updateUserSchema.safeParse(body);

  if (!parsed.success) return jsonErr(parsed.error.issues[0].message);

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
    app_metadata: { role: parsed.data.role },
    user_metadata: { role: parsed.data.role },
  });

  if (error) return jsonErr(error.message, 500);

  await auditLog({ userId: user.id, action: "update_role", entity: "user", entityId: id, diff: parsed.data });

  return jsonOk({
    id: data.user.id,
    email: data.user.email,
    role: parsed.data.role,
  });
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await assertAdmin();
  const { id } = await params;

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) return jsonErr(error.message, 500);

  await auditLog({ userId: user.id, action: "delete", entity: "user", entityId: id });

  return jsonOk({ deleted: true });
}
