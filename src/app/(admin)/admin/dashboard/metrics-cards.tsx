import {
  DollarSign, TrendingUp, ShoppingCart, Users,
  Package, AlertTriangle, Star,
} from "lucide-react";
import { KpiCard } from "@/components/admin/kpi-card";
import { formatBRL } from "@/lib/utils/format";

interface MetricsCardsProps {
  totalRevenue: number;
  revenue30d: number;
  revenueTrend: number;
  ordersToday: number;
  pendingOrders: number;
  aov: number;
  activeCustomers: number;
  lowStock: number;
  topProductName: string;
}

export function MetricsCards(props: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Receita total"
        value={formatBRL(props.totalRevenue)}
        icon={DollarSign}
      />
      <KpiCard
        label="Receita 30d"
        value={formatBRL(props.revenue30d)}
        trend={{ value: props.revenueTrend, positive: props.revenueTrend >= 0 }}
        icon={TrendingUp}
      />
      <KpiCard
        label="Pedidos hoje"
        value={props.ordersToday}
        hint={props.pendingOrders > 0 ? `${props.pendingOrders} pendentes` : undefined}
        icon={ShoppingCart}
      />
      <KpiCard
        label="Ticket médio"
        value={props.aov > 0 ? formatBRL(props.aov) : "—"}
        hint={props.aov === 0 ? "sem dados ainda" : undefined}
        icon={DollarSign}
      />
      <KpiCard
        label="Clientes ativos 30d"
        value={props.activeCustomers}
        icon={Users}
      />
      <KpiCard
        label="Estoque baixo"
        value={props.lowStock}
        hint={props.lowStock > 0 ? "produtos < 5 un." : "tudo ok"}
        icon={AlertTriangle}
      />
      <KpiCard
        label="Top produto"
        value={props.topProductName || "—"}
        hint={props.topProductName ? "mais vendido" : "sem vendas ainda"}
        icon={Star}
      />
      <KpiCard
        label="Pedidos totais"
        value={props.ordersToday + props.pendingOrders}
        icon={Package}
      />
    </div>
  );
}
