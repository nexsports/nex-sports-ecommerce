import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { coupons } from "@/lib/db/schema";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";
import { auditLog } from "@/lib/auth/audit";

const updateCouponSchema = z.object({
  code: z.string().min(1).max(50).optional(),
  type: z.enum(["percent", "fixed", "freeshipping"]).optional(),
  value: z.number().int().nonnegative().optional(),
  minSubtotal: z.number().int().nonnegative().nullable().optional(),
  maxUses: z.number().int().positive().nullable().optional(),
  validFrom: z.string().datetime().nullable().optional(),
  validTo: z.string().datetime().nullable().optional(),
  active: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  await assertAdmin();
  const { id } = await params;

  const coupon = await db.query.coupons.findFirst({ where: eq(coupons.id, id) });
  if (!coupon) return jsonErr("Cupom não encontrado", 404);
  return jsonOk(coupon);
}

export async function PATCH(req: Request, { params }: Params) {
  const user = await assertAdmin();
  const { id } = await params;
  const body = await req.json();
  const parsed = updateCouponSchema.safeParse(body);

  if (!parsed.success) return jsonErr(parsed.error.issues[0].message);

  const existing = await db.query.coupons.findFirst({ where: eq(coupons.id, id) });
  if (!existing) return jsonErr("Cupom não encontrado", 404);

  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.validFrom !== undefined) {
    updateData.validFrom = parsed.data.validFrom ? new Date(parsed.data.validFrom) : null;
  }
  if (parsed.data.validTo !== undefined) {
    updateData.validTo = parsed.data.validTo ? new Date(parsed.data.validTo) : null;
  }

  const [updated] = await db
    .update(coupons)
    .set(updateData)
    .where(eq(coupons.id, id))
    .returning();

  await auditLog({ userId: user.id, action: "update", entity: "coupon", entityId: id, diff: parsed.data });

  return jsonOk(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await assertAdmin();
  const { id } = await params;

  const existing = await db.query.coupons.findFirst({ where: eq(coupons.id, id) });
  if (!existing) return jsonErr("Cupom não encontrado", 404);

  await db.delete(coupons).where(eq(coupons.id, id));

  await auditLog({ userId: user.id, action: "delete", entity: "coupon", entityId: id });

  return jsonOk({ deleted: true });
}
