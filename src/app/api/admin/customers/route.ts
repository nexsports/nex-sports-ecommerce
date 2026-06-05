import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";

export async function GET(req: Request) {
  await assertAdmin();

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "50")));
  const offset = (page - 1) * limit;

  const rows = await db.query.users.findMany({
    where: eq(users.role, "customer"),
    orderBy: desc(users.createdAt),
    limit,
    offset,
    with: {
      addresses: true,
    },
  });

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(eq(users.role, "customer"));

  return jsonOk({ data: rows, total: count, page, limit });
}
