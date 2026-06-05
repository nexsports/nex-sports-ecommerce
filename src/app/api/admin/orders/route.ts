import { desc, sql, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { orders } from "@/lib/db/schema";
import { assertAdmin, jsonOk } from "@/lib/api/admin-auth";

export async function GET(req: Request) {
  await assertAdmin();

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "50")));
  const status = url.searchParams.get("status");
  const offset = (page - 1) * limit;

  let where;
  if (status && ["pending", "paid", "preparing", "shipped", "delivered", "cancelled", "refunded"].includes(status)) {
    where = eq(orders.status, status as typeof orders.$inferSelect.status);
  }

  const rows = await db.query.orders.findMany({
    where,
    orderBy: desc(orders.createdAt),
    limit,
    offset,
    with: {
      items: true,
    },
  });

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(where ?? sql`true`);

  return jsonOk({ data: rows, total: count, page, limit });
}
