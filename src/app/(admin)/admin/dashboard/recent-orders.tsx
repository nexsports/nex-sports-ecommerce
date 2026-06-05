import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatBRL } from "@/lib/utils/format";

interface OrderRow {
  id: string;
  code: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

export function RecentOrders({ orders }: { orders: OrderRow[] }) {
  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Últimos pedidos</CardTitle>
        <Link
          href="/admin/pedidos"
          className="text-xs text-primary hover:underline"
        >
          Ver todos
        </Link>
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
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">
                    Nenhum pedido ainda
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-2.5 font-mono text-xs">
                      <Link href={`/admin/pedidos/${order.code}`} className="hover:underline">
                        {order.code}
                      </Link>
                    </td>
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
  );
}
