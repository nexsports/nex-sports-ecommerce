import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";
import { auditLog } from "@/lib/auth/audit";

const updatePartnerSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  logoUrl: z.string().nullable().optional(),
  website: z.string().url().nullable().optional(),
  position: z.number().int().optional(),
  active: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const user = await assertAdmin();
  const { id } = await params;
  const body = await req.json();
  const parsed = updatePartnerSchema.safeParse(body);

  if (!parsed.success) return jsonErr(parsed.error.issues[0].message);

  const { data, error } = await supabaseAdmin
    .from("partners")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return jsonErr(error.message, 500);
  if (!data) return jsonErr("Parceiro não encontrado", 404);

  await auditLog({ userId: user.id, action: "update", entity: "partner", entityId: id, diff: parsed.data });

  return jsonOk(data);
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await assertAdmin();
  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("partners")
    .delete()
    .eq("id", id);

  if (error) return jsonErr(error.message, 500);

  await auditLog({ userId: user.id, action: "delete", entity: "partner", entityId: id });

  return jsonOk({ deleted: true });
}
