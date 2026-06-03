import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { formatBRL, maskCPF, maskPhoneBR } from "@/lib/utils/format";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: user } = await supabaseAdmin.from("users").select("name").eq("id", id).single();
  return { title: `${user?.name ?? "Cliente"} — NEX Admin` };
}

export default async function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [userRes, addressesRes, ordersRes] = await Promise.all([
    supabaseAdmin.from("users").select("*").eq("id", id).eq("role", "customer").single(),
    supabaseAdmin.from("addresses").select("*").eq("user_id", id).order("is_default", { ascending: false }),
    supabaseAdmin
      .from("orders")
      .select("id,code,status,total,created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const user = userRes.data;
  if (!user) notFound();

  const addresses = addressesRes.data ?? [];
  const orders = ordersRes.data ?? [];
  const totalSpent = orders
    .filter((o) => ["paid", "preparing", "shipped", "delivered"].includes(o.status))
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/admin/clientes" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
          <ArrowLeft className="h-3 w-3" /> Voltar para clientes
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{user.name ?? "Cliente"}</h1>
        <p className="text-sm text-muted-foreground">
          Cliente desde {new Date(user.created_at).toLocaleDateString("pt-BR")}
        </p>
      </div>

      <Separator className="bg-border" />

      {/* Profile card */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Dados pessoais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs mb-0.5">Nome</p>
            <p>{user.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-0.5">Email</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-0.5">Telefone</p>
            <p>{user.phone ? maskPhoneBR(user.phone) : "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-0.5">CPF</p>
            <p>{user.cpf ? maskCPF(user.cpf) : "—"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-xs text-muted-foreground">Pedidos</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{formatBRL(totalSpent)}</p>
            <p className="text-xs text-muted-foreground">Total gasto</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{addresses.length}</p>
            <p className="text-xs text-muted-foreground">Endereços</p>
          </CardContent>
        </Card>
      </div>

      {/* Addresses */}
      {addresses.length > 0 && (
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Endereços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="rounded-xl border border-border bg-secondary/30 p-4 text-sm space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{addr.label ?? "Endereço"}</span>
                    {addr.is_default && <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-0">Padrão</Badge>}
                  </div>
                  <p>{addr.recipient}</p>
                  <p>{addr.street}, {addr.number}{addr.complement ? ` — ${addr.complement}` : ""}</p>
                  <p>{addr.neighborhood} — {addr.city}/{addr.state}</p>
                  <p className="text-muted-foreground">CEP: {addr.cep}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum pedido realizado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Código</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Total</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0">
                      <td className="px-3 py-2.5">
                        <Link href={`/admin/pedidos/${order.code}`} className="font-mono text-xs text-primary hover:underline">
                          {order.code}
                        </Link>
                      </td>
                      <td className="px-3 py-2.5"><StatusBadge status={order.status} /></td>
                      <td className="px-3 py-2.5 text-right">{formatBRL(order.total)}</td>
                      <td className="px-3 py-2.5 text-muted-foreground text-xs">
                        {new Date(order.created_at).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
