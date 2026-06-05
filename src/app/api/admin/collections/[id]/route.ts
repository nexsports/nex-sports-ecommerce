import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";
import { auditLog } from "@/lib/auth/audit";

const updateCollectionSchema = z.object({
  slug: z.string().min(1).max(80).optional(),
  name: z.string().min(1).max(120).optional(),
  type: z.enum(["manual", "rule"]).optional(),
  ruleJson: z.unknown().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),
  position: z.number().int().optional(),
  active: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  await assertAdmin();
  const { id } = await params;

  const collection = await db.query.collections.findFirst({ where: eq(collections.id, id) });
  if (!collection) return jsonErr("Coleção não encontrada", 404);
  return jsonOk(collection);
}

export async function PATCH(req: Request, { params }: Params) {
  const user = await assertAdmin();
  const { id } = await params;
  const body = await req.json();
  const parsed = updateCollectionSchema.safeParse(body);

  if (!parsed.success) return jsonErr(parsed.error.issues[0].message);

  const existing = await db.query.collections.findFirst({ where: eq(collections.id, id) });
  if (!existing) return jsonErr("Coleção não encontrada", 404);

  const [updated] = await db
    .update(collections)
    .set(parsed.data)
    .where(eq(collections.id, id))
    .returning();

  await auditLog({ userId: user.id, action: "update", entity: "collection", entityId: id, diff: parsed.data });

  return jsonOk(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await assertAdmin();
  const { id } = await params;

  const existing = await db.query.collections.findFirst({ where: eq(collections.id, id) });
  if (!existing) return jsonErr("Coleção não encontrada", 404);

  await db.delete(collections).where(eq(collections.id, id));

  await auditLog({ userId: user.id, action: "delete", entity: "collection", entityId: id });

  return jsonOk({ deleted: true });
}
