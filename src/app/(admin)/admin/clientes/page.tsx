import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { formatBRL } from "@/lib/utils/format";
import { ClientesSearch } from "./clientes-search";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clientes — NEX Admin" };

interface SearchParams {
  q?: string;
}

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = params.q?.trim().toLowerCase();

  // Fetch customers
  const { data: users } = await supabaseAdmin
    .from("users")
    .select("id,name,email,created_at")
    .eq("role", "customer")
    .order("created_at", { ascending: false })
    .limit(200);

  // Filter by search
  const filtered = q
    ? (users ?? []).filter((u) => u.email?.toLowerCase().includes(q) || u.name?.toLowerCase().includes(q))
    : users ?? [];

  // Fetch order stats for these customers
  const userIds = filtered.map((u) => u.id);
  const { data: orderStats } = userIds.length
    ? await supabaseAdmin
        .from("orders")
        .select("user_id,total,created_at")
        .in("user_id", userIds)
        .in("status", ["paid", "preparing", "shipped", "delivered"])
    : { data: [] as { user_id: string; total: number; created_at: string }[] };

  // Build stats map
  const statsMap = new Map<string, { count: number; total: number; lastOrder: string }>();
  for (const o of orderStats ?? []) {
    const existing = statsMap.get(o.user_id) ?? { count: 0, total: 0, lastOrder: "" };
    existing.count++;
    existing.total += o.total;
    if (!existing.lastOrder || o.created_at > existing.lastOrder) {
      existing.lastOrder = o.created_at;
    }
    statsMap.set(o.user_id, existing);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>

      <ClientesSearch searchQ={params.q} />

      <div className="rounded-2xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Nome</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">Pedidos</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">Total gasto</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Último pedido</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  Nenhum cliente encontrado
                </td>
              </tr>
            ) : (
              filtered.map((user) => {
                const stats = statsMap.get(user.id);
                return (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/clientes/${user.id}`} className="text-primary hover:underline">
                        {user.name ?? "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3 text-right">{stats?.count ?? 0}</td>
                    <td className="px-4 py-3 text-right">{stats ? formatBRL(stats.total) : "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {stats?.lastOrder ? new Date(stats.lastOrder).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(user.created_at).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
