import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { formatBRL, maskCPF, maskPhoneBR } from "@/lib/utils/format";
import { StatusBadge } from "@/components/admin/status-badge";
import { OrderTimeline } from "@/components/admin/order-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { OrderActions } from "./order-actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return { title: `Pedido ${code} — NEX Admin` };
}

export default async function PedidoDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*), order_events(*)")
    .eq("code", code)
    .single();

  if (!order) notFound();

  const shippingAddress = order.shipping_address as Record<string, string> | null;
  const events = (order.order_events ?? [])
    .sort((a: { created_at: string }, b: { created_at: string }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((ev: { id: string; type: string; created_at: string; payload: Record<string, unknown> }) => ({
      id: ev.id,
      type: ev.type,
      label: getEventLabel(ev.type, ev.payload),
      date: new Date(ev.created_at).toLocaleString("pt-BR"),
      detail: getEventDetail(ev.type, ev.payload),
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/pedidos" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
            <ArrowLeft className="h-3 w-3" /> Voltar para pedidos
          </Link>
          <h1 className="text-2xl font-bold tracking-tight font-mono">{order.code}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleString("pt-BR")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.payment_status} />
          {order.shipping_status && <StatusBadge status={order.shipping_status} />}
          <span className="text-xl font-bold">{formatBRL(order.total)}</span>
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Actions */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderActions
            orderId={order.id}
            orderCode={order.code}
            currentStatus={order.status}
            currentNotes={order.notes_internal ?? ""}
          />
        </CardContent>
      </Card>

      {/* Info grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Customer */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Nome:</span> {order.customer_name ?? "—"}</p>
            <p><span className="text-muted-foreground">Email:</span> {order.customer_email ?? "—"}</p>
            <p><span className="text-muted-foreground">Telefone:</span> {order.customer_phone ? maskPhoneBR(order.customer_phone) : "—"}</p>
            <p><span className="text-muted-foreground">CPF:</span> {order.customer_cpf ? maskCPF(order.customer_cpf) : "—"}</p>
          </CardContent>
        </Card>

        {/* Shipping address */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Endereço de entrega</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {shippingAddress ? (
              <div className="space-y-1">
                <p>{shippingAddress.recipient ?? ""}</p>
                <p>{shippingAddress.street}, {shippingAddress.number}{shippingAddress.complement ? ` — ${shippingAddress.complement}` : ""}</p>
                <p>{shippingAddress.neighborhood} — {shippingAddress.city}/{shippingAddress.state}</p>
                <p>CEP: {shippingAddress.cep ?? "—"}</p>
              </div>
            ) : (
              <p>Nenhum endereço informado</p>
            )}
          </CardContent>
        </Card>

        {/* Payment */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Método:</span> {order.payment_method ?? "—"}</p>
            <p><span className="text-muted-foreground">ID pagamento:</span> <span className="font-mono text-xs">{order.payment_id ?? "—"}</span></p>
            {order.coupon_code && (
              <p><span className="text-muted-foreground">Cupom:</span> <Badge variant="outline" className="text-xs">{order.coupon_code}</Badge></p>
            )}
          </CardContent>
        </Card>

        {/* Values */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Valores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatBRL(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Desconto</span><span className="text-green-500">-{formatBRL(order.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Frete</span><span>{formatBRL(order.shipping)}</span></div>
            <Separator className="bg-border" />
            <div className="flex justify-between font-bold"><span>Total</span><span>{formatBRL(order.total)}</span></div>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Itens do pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Produto</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Variação</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Qtd</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Preço unit.</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.order_items ?? []).map((item: { id: string; snapshot: Record<string, unknown>; qty: number; unit_price: number }) => {
                  const snap = item.snapshot ?? {};
                  return (
                    <tr key={item.id} className="border-b border-border last:border-0">
                      <td className="px-3 py-2.5">{(snap.product_name as string) ?? "—"}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{(snap.variant_label as string) ?? "—"}</td>
                      <td className="px-3 py-2.5 text-right">{item.qty}</td>
                      <td className="px-3 py-2.5 text-right">{formatBRL(item.unit_price)}</td>
                      <td className="px-3 py-2.5 text-right font-medium">{formatBRL(item.unit_price * item.qty)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tracking info */}
      {order.tracking_code && (
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Rastreamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Código:</span> <span className="font-mono">{order.tracking_code}</span></p>
            {order.shipping_carrier && <p><span className="text-muted-foreground">Transportadora:</span> {order.shipping_carrier}</p>}
            {order.shipping_service && <p><span className="text-muted-foreground">Serviço:</span> {order.shipping_service}</p>}
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTimeline events={events} />
        </CardContent>
      </Card>
    </div>
  );
}

function getEventLabel(type: string, payload: Record<string, unknown>): string {
  if (type === "status_changed") {
    const to = payload.to as string;
    const labels: Record<string, string> = {
      paid: "Pagamento confirmado",
      preparing: "Preparando envio",
      shipped: "Pedido enviado",
      delivered: "Pedido entregue",
      cancelled: "Pedido cancelado",
      refunded: "Pedido reembolsado",
    };
    return labels[to] ?? `Status alterado para ${to}`;
  }
  if (type === "created") return "Pedido criado";
  if (type === "note_added") return "Nota adicionada";
  return type;
}

function getEventDetail(type: string, payload: Record<string, unknown>): string | undefined {
  if (type === "status_changed" && payload.trackingCode) {
    return `Rastreio: ${payload.trackingCode} — ${payload.carrier ?? ""}`;
  }
  return undefined;
}
