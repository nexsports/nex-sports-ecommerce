import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";
import { auditLog } from "@/lib/auth/audit";

const createPartnerSchema = z.object({
  name: z.string().min(1).max(120),
  logoUrl: z.string().nullable().optional(),
  website: z.string().url().nullable().optional(),
  position: z.number().int().default(0),
  active: z.boolean().default(true),
});

export async function GET() {
  await assertAdmin();

  const { data, error } = await supabaseAdmin
    .from("partners")
    .select("*")
    .order("position", { ascending: true });

  if (error) return jsonErr(error.message, 500);
  return jsonOk(data);
}

export async function POST(req: Request) {
  const user = await assertAdmin();
  const body = await req.json();
  const parsed = createPartnerSchema.safeParse(body);

  if (!parsed.success) return jsonErr(parsed.error.issues[0].message);

  const { data, error } = await supabaseAdmin
    .from("partners")
    .insert(parsed.data)
    .select()
    .single();

  if (error) return jsonErr(error.message, 500);

  await auditLog({ userId: user.id, action: "create", entity: "partner", entityId: data.id });

  return jsonOk(data, 201);
}
