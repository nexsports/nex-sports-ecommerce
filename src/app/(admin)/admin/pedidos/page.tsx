import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { formatBRL } from "@/lib/utils/format";
import { StatusBadge } from "@/components/admin/status-badge";
import { PedidosFilters } from "./pedidos-filters";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pedidos — NEX Admin" };

interface SearchParams {
  status?: string;
  payment?: string;
  q?: string;
}

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const statusFilter = params.status;
  const paymentFilter = params.payment;
  const q = params.q?.trim();

  let query = supabaseAdmin
    .from("orders")
    .select("id,code,customer_name,customer_email,total,status,payment_status,payment_method,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (statusFilter) query = query.eq("status", statusFilter);
  if (paymentFilter) query = query.eq("payment_status", paymentFilter);

  const { data: orders } = await query;

  const filtered = q
    ? (orders ?? []).filter(
        (o) =>
          o.code.toLowerCase().includes(q.toLowerCase()) ||
          o.customer_email?.toLowerCase().includes(q.toLowerCase())
      )
    : orders ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>

      <PedidosFilters
        statusFilter={statusFilter}
        paymentFilter={paymentFilter}
        searchQ={params.q}
      />

      <div className="rounded-2xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Código</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Cliente</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Pagamento</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Data</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  Nenhum pedido encontrado
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/pedidos/${order.code}`} className="font-mono text-xs text-primary hover:underline">
                      {order.code}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{order.customer_name ?? "—"}</td>
                  <td className="px-4 py-3">{formatBRL(order.total)}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3"><StatusBadge status={order.payment_status} /></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(order.created_at).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
