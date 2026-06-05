import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { MetricsCards } from "./metrics-cards";
import { DashboardRevenueChart } from "./revenue-chart";
import { TopProducts } from "./top-products";
import { RecentOrders } from "./recent-orders";
import { ActivityFeed } from "./activity-feed";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export const metadata = { title: "Dashboard — NEX Admin" };

async function getDashboardData() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString();
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 86400000).toISOString();

  const [
    ordersTotalRes,
    ordersTodayRes,
    ordersPendingRes,
    revenueAllRes,
    revenue30dRes,
    revenue60dRes,
    dailyRevenueRes,
    orderItemsRes,
    productsRes,
    customersRes,
    recentOrdersRes,
    activityRes,
  ] = await Promise.all([
    supabaseAdmin.from("orders").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("orders").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
    supabaseAdmin.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabaseAdmin.from("orders").select("total").in("status", ["paid", "shipped", "delivered"]),
    supabaseAdmin.from("orders").select("total,created_at").in("status", ["paid", "shipped", "delivered"]).gte("created_at", thirtyDaysAgo),
    supabaseAdmin.from("orders").select("total").in("status", ["paid", "shipped", "delivered"]).gte("created_at", sixtyDaysAgo).lt("created_at", thirtyDaysAgo),
    supabaseAdmin.from("orders").select("total,created_at").in("status", ["paid", "shipped", "delivered"]).gte("created_at", thirtyDaysAgo).order("created_at"),
    supabaseAdmin.from("order_items").select("variant_id, qty, unit_price, snapshot").gte("created_at", thirtyDaysAgo),
    supabaseAdmin.from("products").select("id, title, slug").eq("status", "active"),
    supabaseAdmin.from("users").select("id", { count: "exact", head: true }).eq("role", "customer").gte("created_at", thirtyDaysAgo),
    supabaseAdmin.from("orders").select("id,code,customer_name,total,status,created_at").order("created_at", { ascending: false }).limit(10),
    supabaseAdmin.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(20),
  ]);

  // Revenue totals
  const totalRevenue = (revenueAllRes.data ?? []).reduce((s, o) => s + o.total, 0);
  const revenue30d = (revenue30dRes.data ?? []).reduce((s, o) => s + o.total, 0);
  const revenue60d = (revenue60dRes.data ?? []).reduce((s, o) => s + o.total, 0);
  const revenueTrend = revenue60d > 0
    ? Math.round(((revenue30d - revenue60d) / revenue60d) * 100)
    : revenue30d > 0 ? 100 : 0;

  // AOV
  const paidOrders30d = (revenue30dRes.data ?? []).length;
  const aov = paidOrders30d > 0 ? Math.round(revenue30d / paidOrders30d) : 0;

  // Daily revenue aggregation
  const dailyMap = new Map<string, number>();
  for (const o of dailyRevenueRes.data ?? []) {
    const day = new Date(o.created_at).toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + o.total);
  }
  const dailyRevenue = Array.from(dailyMap.entries())
    .map(([date, revenue]) => ({ date: date.slice(5), revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Top products by qty
  const productSales = new Map<string, { qty: number; revenue: number }>();
  for (const item of orderItemsRes.data ?? []) {
    const pid = item.variant_id;
    const existing = productSales.get(pid) ?? { qty: 0, revenue: 0 };
    existing.qty += item.qty;
    existing.revenue += item.unit_price * item.qty;
    productSales.set(pid, existing);
  }

  // Map variant -> product
  const variantIds = Array.from(productSales.keys());
  let variantToProduct = new Map<string, { title: string; productId: string }>();
  if (variantIds.length > 0) {
    const { data: variants } = await supabaseAdmin
      .from("product_variants")
      .select("id, product_id")
      .in("id", variantIds);
    const productIds = [...new Set((variants ?? []).map((v) => v.product_id))];
    const productMap = new Map<string, string>();
    for (const p of productsRes.data ?? []) {
      productMap.set(p.id, p.title);
    }
    for (const v of variants ?? []) {
      variantToProduct.set(v.id, {
        title: productMap.get(v.product_id) ?? "Produto removido",
        productId: v.product_id,
      });
    }
  }

  // Aggregate by product
  const productAgg = new Map<string, { title: string; qty: number; revenue: number }>();
  for (const [vid, sales] of productSales) {
    const info = variantToProduct.get(vid);
    if (!info) continue;
    const existing = productAgg.get(info.productId) ?? { title: info.title, qty: 0, revenue: 0 };
    existing.qty += sales.qty;
    existing.revenue += sales.revenue;
    productAgg.set(info.productId, existing);
  }

  const topProducts = Array.from(productAgg.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)
    .map((p) => ({ title: p.title, imageUrl: null, qty: p.qty, revenue: p.revenue }));

  // Get top product images
  if (topProducts.length > 0) {
    const topIds = Array.from(productAgg.entries())
      .sort(([, a], [, b]) => b.qty - a.qty)
      .slice(0, 5)
      .map(([id]) => id);
    const { data: imgs } = await supabaseAdmin
      .from("product_images")
      .select("product_id, url")
      .in("product_id", topIds)
      .eq("position", 0);
    const imgMap = new Map((imgs ?? []).map((i) => [i.product_id, i.url]));
    for (let i = 0; i < topIds.length && i < topProducts.length; i++) {
      topProducts[i].imageUrl = imgMap.get(topIds[i]) ?? null;
    }
  }

  // Low stock
  const { count: lowStockCount } = await supabaseAdmin
    .from("product_variants")
    .select("id", { count: "exact", head: true })
    .lt("stock", 5)
    .gt("stock", 0);

  // Active customers 30d (users who placed orders)
  const { data: activeCustData } = await supabaseAdmin
    .from("orders")
    .select("user_id")
    .gte("created_at", thirtyDaysAgo)
    .not("user_id", "is", null);
  const activeCustomers = new Set((activeCustData ?? []).map((o) => o.user_id)).size;

  return {
    totalRevenue,
    revenue30d,
    revenueTrend,
    ordersToday: ordersTodayRes.count ?? 0,
    pendingOrders: ordersPendingRes.count ?? 0,
    aov,
    activeCustomers,
    lowStock: lowStockCount ?? 0,
    topProductName: topProducts[0]?.title ?? "",
    totalOrders: ordersTotalRes.count ?? 0,
    dailyRevenue,
    topProducts,
    recentOrders: recentOrdersRes.data ?? [],
    activityLogs: activityRes.data ?? [],
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      <MetricsCards
        totalRevenue={data.totalRevenue}
        revenue30d={data.revenue30d}
        revenueTrend={data.revenueTrend}
        ordersToday={data.ordersToday}
        pendingOrders={data.pendingOrders}
        aov={data.aov}
        activeCustomers={data.activeCustomers}
        lowStock={data.lowStock}
        topProductName={data.topProductName}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardRevenueChart data={data.dailyRevenue} />
        </div>
        <TopProducts products={data.topProducts} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders orders={data.recentOrders} />
        </div>
        <ActivityFeed initial={data.activityLogs} />
      </div>
    </div>
  );
}
