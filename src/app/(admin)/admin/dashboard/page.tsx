import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { KpiCard } from "@/components/admin/kpi-card";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderTree, ShoppingCart, Users, DollarSign, TrendingUp } from "lucide-react";
import { formatBRL } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard — NEX Admin" };

async function getKpis() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

  const [
    productsRes,
    categoriesRes,
    ordersTotalRes,
    ordersByStatusRes,
    customersRes,
    revenueRes,
    revenue30dRes,
    recentOrdersRes,
    dailyRevenueRes,
  ] = await Promise.all([
    supabaseAdmin.from("products").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabaseAdmin.from("categories").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("orders").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("orders").select("status"),
    supabaseAdmin.from("users").select("id", { count: "exact", head: true }).eq("role", "customer"),
    supabaseAdmin.from("orders").select("total").in("status", ["paid", "shipped", "delivered"]),
    supabaseAdmin.from("orders").select("total,created_at").in("status", ["paid", "shipped", "delivered"]).gte("created_at", thirtyDaysAgo),
    supabaseAdmin.from("orders").select("id,code,customer_name,total,status,created_at").order("created_at", { ascending: false }).limit(5),
    supabaseAdmin.from("orders").select("total,created_at").in("status", ["paid", "shipped", "delivered"]).gte("created_at", thirtyDaysAgo).order("created_at"),
  ]);

  const totalRevenue = (revenueRes.data ?? []).reduce((s, o) => s + o.total, 0);
  const revenue30d = (revenue30dRes.data ?? []).reduce((s, o) => s + o.total, 0);

  const statusCounts: Record<string, number> = {};
  for (const o of ordersByStatusRes.data ?? []) {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
  }

  // Aggregate daily revenue
  const dailyMap = new Map<string, number>();
  for (const o of dailyRevenueRes.data ?? []) {
    const day = new Date(o.created_at).toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + o.total);
  }
  const dailyRevenue = Array.from(dailyMap.entries())
    .map(([date, revenue]) => ({ date: date.slice(5), revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    activeProducts: productsRes.count ?? 0,
    categories: categoriesRes.count ?? 0,
    totalOrders: ordersTotalRes.count ?? 0,
    statusCounts,
    customers: customersRes.count ?? 0,
    totalRevenue,
    revenue30d,
    recentOrders: recentOrdersRes.data ?? [],
    dailyRevenue,
  };
}

export default async function DashboardPage() {
  const kpis = await getKpis();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard label="Produtos ativos" value={kpis.activeProducts} icon={Package} />
        <KpiCard label="Categorias" value={kpis.categories} icon={FolderTree} />
        <KpiCard
          label="Pedidos"
          value={kpis.totalOrders}
          hint={`${kpis.statusCounts["pending"] ?? 0} pendentes`}
          icon={ShoppingCart}
        />
        <KpiCard label="Clientes" value={kpis.customers} icon={Users} />
        <KpiCard
          label="Receita total"
          value={formatBRL(kpis.totalRevenue)}
          icon={DollarSign}
        />
        <KpiCard
          label="Receita 30d"
          value={formatBRL(kpis.revenue30d)}
          icon={TrendingUp}
        />
      </div>

      {/* Chart */}
      <RevenueChart data={kpis.dailyRevenue} />

      {/* Recent Orders */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Últimos pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Código</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Cliente</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Total</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Data</th>
                </tr>
              </thead>
              <tbody>
                {kpis.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">
                      Nenhum pedido ainda
                    </td>
                  </tr>
                ) : (
                  kpis.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0">
                      <td className="px-3 py-2.5 font-mono text-xs">{order.code}</td>
                      <td className="px-3 py-2.5">{order.customer_name}</td>
                      <td className="px-3 py-2.5">{formatBRL(order.total)}</td>
                      <td className="px-3 py-2.5"><StatusBadge status={order.status} /></td>
                      <td className="px-3 py-2.5 text-muted-foreground text-xs">
                        {new Date(order.created_at).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
