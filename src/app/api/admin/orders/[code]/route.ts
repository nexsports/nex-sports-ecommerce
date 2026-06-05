import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { orders, orderItems, orderEvents } from "@/lib/db/schema";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";
import { auditLog } from "@/lib/auth/audit";

const updateOrderSchema = z.object({
  status: z.enum(["pending", "paid", "preparing", "shipped", "delivered", "cancelled", "refunded"]).optional(),
  shippingStatus: z.enum(["pending", "label_purchased", "shipped", "in_transit", "delivered", "returned"]).optional(),
  trackingCode: z.string().max(60).optional(),
  shippingCarrier: z.string().max(60).optional(),
  shippingService: z.string().max(60).optional(),
  notesInternal: z.string().optional(),
});

type Params = { params: Promise<{ code: string }> };

export async function GET(_req: Request, { params }: Params) {
  await assertAdmin();
  const { code } = await params;

  const order = await db.query.orders.findFirst({
    where: eq(orders.code, code),
    with: {
      items: true,
      events: { orderBy: orderEvents.createdAt },
    },
  });

  if (!order) return jsonErr("Pedido não encontrado", 404);
  return jsonOk(order);
}

export async function PATCH(req: Request, { params }: Params) {
  const user = await assertAdmin();
  const { code } = await params;
  const body = await req.json();
  const parsed = updateOrderSchema.safeParse(body);

  if (!parsed.success) return jsonErr(parsed.error.issues[0].message);

  const existing = await db.query.orders.findFirst({ where: eq(orders.code, code) });
  if (!existing) return jsonErr("Pedido não encontrado", 404);

  const [updated] = await db
    .update(orders)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(orders.code, code))
    .returning();

  // Log event
  await db.insert(orderEvents).values({
    orderId: existing.id,
    type: "admin_update",
    payload: { userId: user.id, changes: parsed.data },
  });

  await auditLog({ userId: user.id, action: "update", entity: "order", entityId: existing.id, diff: parsed.data });

  return jsonOk(updated);
}
