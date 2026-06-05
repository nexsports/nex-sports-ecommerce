import { sql, eq, gte } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { products, categories, orders, users, orderItems } from "@/lib/db/schema";
import { assertAdmin, jsonOk } from "@/lib/api/admin-auth";

export async function GET() {
  await assertAdmin();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Counts
  const [productCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(eq(products.status, "active"));

  const [categoryCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(categories);

  const [pendingOrders] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(eq(orders.status, "pending"));

  const [customerCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(eq(users.role, "customer"));

  // Revenue
  const [totalRevenue] = await db
    .select({ total: sql<number>`coalesce(sum(${orders.total}), 0)::int` })
    .from(orders)
    .where(sql`${orders.status} NOT IN ('cancelled', 'refunded')`);

  const [revenue30d] = await db
    .select({ total: sql<number>`coalesce(sum(${orders.total}), 0)::int` })
    .from(orders)
    .where(
      sql`${orders.status} NOT IN ('cancelled', 'refunded') AND ${orders.createdAt} >= ${thirtyDaysAgo.toISOString()}`,
    );

  // Top 5 products by sales
  const topProducts = await db
    .select({
      id: products.id,
      title: products.title,
      salesCount: products.salesCount,
    })
    .from(products)
    .where(eq(products.status, "active"))
    .orderBy(sql`${products.salesCount} desc`)
    .limit(5);

  // Revenue series (last 30 days)
  const revenueSeries = await db
    .select({
      date: sql<string>`date(${orders.createdAt})`,
      total: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
    })
    .from(orders)
    .where(
      sql`${orders.status} NOT IN ('cancelled', 'refunded') AND ${orders.createdAt} >= ${thirtyDaysAgo.toISOString()}`,
    )
    .groupBy(sql`date(${orders.createdAt})`)
    .orderBy(sql`date(${orders.createdAt})`);

  return jsonOk({
    counts: {
      activeProducts: productCount.count,
      categories: categoryCount.count,
      pendingOrders: pendingOrders.count,
      customers: customerCount.count,
    },
    revenue: {
      total: totalRevenue.total,
      last30d: revenue30d.total,
    },
    topProducts,
    revenueSeries,
  });
}
