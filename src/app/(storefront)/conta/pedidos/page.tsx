import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Package } from "lucide-react";
import { formatBRL } from "@/lib/utils/format";

export const metadata = { title: "Pedidos" };

export default async function PedidosPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, code, status, payment_status, total, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 md:py-16 rounded-2xl border border-border bg-card">
        <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Nenhum pedido ainda</h2>
        <p className="text-muted-foreground text-sm mb-6">Que tal começar agora?</p>
        <Link href="/" className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90">
          Explorar produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold">Meus pedidos</h1>
      <div className="space-y-3">
        {orders.map((o: any) => (
          <Link
            key={o.id}
            href={`/conta/pedidos/${o.code}`}
            className="block rounded-2xl border border-border bg-card p-5 hover:border-accent transition-colors"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("pt-BR")}</p>
                <p className="font-mono text-sm mt-1">{o.code}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatBRL(o.total)}</p>
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent capitalize">{o.status}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
