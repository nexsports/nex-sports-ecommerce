import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { coupons } from "@/lib/db/schema";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";
import { auditLog } from "@/lib/auth/audit";

const createCouponSchema = z.object({
  code: z.string().min(1).max(50),
  type: z.enum(["percent", "fixed", "freeshipping"]),
  value: z.number().int().nonnegative(),
  minSubtotal: z.number().int().nonnegative().optional(),
  maxUses: z.number().int().positive().optional(),
  validFrom: z.string().datetime().optional(),
  validTo: z.string().datetime().optional(),
  active: z.boolean().default(true),
});

export async function GET() {
  await assertAdmin();

  const rows = await db.query.coupons.findMany({
    orderBy: desc(coupons.createdAt),
  });

  return jsonOk(rows);
}

export async function POST(req: Request) {
  const user = await assertAdmin();
  const body = await req.json();
  const parsed = createCouponSchema.safeParse(body);

  if (!parsed.success) return jsonErr(parsed.error.issues[0].message);

  const existing = await db.query.coupons.findFirst({
    where: eq(coupons.code, parsed.data.code.toUpperCase()),
  });
  if (existing) return jsonErr("Cupom já existe", 409);

  const [created] = await db.insert(coupons).values({
    ...parsed.data,
    code: parsed.data.code.toUpperCase(),
    validFrom: parsed.data.validFrom ? new Date(parsed.data.validFrom) : null,
    validTo: parsed.data.validTo ? new Date(parsed.data.validTo) : null,
  }).returning();

  await auditLog({ userId: user.id, action: "create", entity: "coupon", entityId: created.id });

  return jsonOk(created, 201);
}
