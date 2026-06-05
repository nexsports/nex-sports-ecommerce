import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";

const updateCustomerSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  phone: z.string().max(30).optional(),
  marketingOptIn: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  await assertAdmin();
  const { id } = await params;

  const customer = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      addresses: true,
      orders: true,
    },
  });

  if (!customer) return jsonErr("Cliente não encontrado", 404);
  return jsonOk(customer);
}

export async function PATCH(req: Request, { params }: Params) {
  await assertAdmin();
  const { id } = await params;
  const body = await req.json();
  const parsed = updateCustomerSchema.safeParse(body);

  if (!parsed.success) return jsonErr(parsed.error.issues[0].message);

  const existing = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!existing) return jsonErr("Cliente não encontrado", 404);

  const [updated] = await db
    .update(users)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();

  return jsonOk(updated);
}
