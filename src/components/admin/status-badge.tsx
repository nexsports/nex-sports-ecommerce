import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-muted text-muted-foreground" },
  paid: { label: "Pago", className: "bg-accent/20 text-accent" },
  approved: { label: "Aprovado", className: "bg-accent/20 text-accent" },
  preparing: { label: "Preparando", className: "bg-primary/20 text-primary" },
  shipped: { label: "Enviado", className: "bg-primary/20 text-primary" },
  in_transit: { label: "Em trânsito", className: "bg-primary/20 text-primary" },
  delivered: { label: "Entregue", className: "bg-green-500/20 text-green-500" },
  cancelled: { label: "Cancelado", className: "bg-destructive/20 text-destructive" },
  refunded: { label: "Reembolsado", className: "bg-destructive/20 text-destructive" },
  rejected: { label: "Rejeitado", className: "bg-destructive/20 text-destructive" },
  chargeback: { label: "Chargeback", className: "bg-destructive/20 text-destructive" },
  active: { label: "Ativo", className: "bg-green-500/20 text-green-500" },
  draft: { label: "Rascunho", className: "bg-muted text-muted-foreground" },
  archived: { label: "Arquivado", className: "bg-muted text-muted-foreground" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <Badge variant="outline" className={cn("text-xs border-0", config.className)}>
      {config.label}
    </Badge>
  );
}
