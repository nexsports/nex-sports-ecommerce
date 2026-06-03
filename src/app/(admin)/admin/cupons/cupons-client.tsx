"use client";

import { useState, useTransition } from "react";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Ticket } from "lucide-react";
import { createCoupon, updateCoupon, deleteCoupon } from "./actions";
import { formatBRL } from "@/lib/utils/format";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed" | "freeshipping";
  value: number;
  min_subtotal: number;
  max_uses: number;
  used: number;
  valid_from: string | null;
  valid_to: string | null;
  active: boolean;
  created_at: string;
}

const typeLabels: Record<string, string> = {
  percent: "Percentual",
  fixed: "Valor fixo",
  freeshipping: "Frete grátis",
};

function formatValue(coupon: Coupon) {
  if (coupon.type === "percent") return `${coupon.value}%`;
  if (coupon.type === "freeshipping") return "Frete grátis";
  return formatBRL(coupon.value);
}

export function CuponsClient({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    code: "",
    type: "percent" as "percent" | "fixed" | "freeshipping",
    value: 0,
    minSubtotal: 0,
    maxUses: 0,
    validFrom: "",
    validTo: "",
    active: true,
  });

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditing(null);
    setForm({
      code: "",
      type: "percent",
      value: 0,
      minSubtotal: 0,
      maxUses: 0,
      validFrom: "",
      validTo: "",
      active: true,
    });
    setModalOpen(true);
  }

  function openEdit(coupon: Coupon) {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minSubtotal: coupon.min_subtotal,
      maxUses: coupon.max_uses,
      validFrom: coupon.valid_from ? coupon.valid_from.slice(0, 10) : "",
      validTo: coupon.valid_to ? coupon.valid_to.slice(0, 10) : "",
      active: coupon.active,
    });
    setModalOpen(true);
  }

  function handleSubmit() {
    const fd = new FormData();
    fd.append("code", form.code);
    fd.append("type", form.type);
    fd.append("value", String(form.value));
    fd.append("minSubtotal", String(form.minSubtotal));
    fd.append("maxUses", String(form.maxUses));
    fd.append("validFrom", form.validFrom);
    fd.append("validTo", form.validTo);
    fd.append("active", String(form.active));

    startTransition(async () => {
      try {
        if (editing) {
          await updateCoupon(editing.id, fd);
          toast.success("Cupom atualizado");
        } else {
          await createCoupon(fd);
          toast.success("Cupom criado");
        }
        setModalOpen(false);
        window.location.reload();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Erro ao salvar");
      }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteCoupon(deleteTarget.id);
        setCoupons((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
        toast.success("Cupom excluído");
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Erro ao excluir");
      }
    });
  }

  const columns = [
    {
      key: "code",
      header: "Código",
      render: (row: Coupon) => (
        <div className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono font-medium text-sm">{row.code}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Tipo",
      render: (row: Coupon) => (
        <Badge variant="outline" className="text-xs bg-secondary">
          {typeLabels[row.type]}
        </Badge>
      ),
    },
    {
      key: "value",
      header: "Valor",
      render: (row: Coupon) => <span className="text-sm">{formatValue(row)}</span>,
    },
    {
      key: "min_subtotal",
      header: "Subtotal mín.",
      render: (row: Coupon) => (
        <span className="text-sm">{row.min_subtotal > 0 ? formatBRL(row.min_subtotal) : "—"}</span>
      ),
    },
    {
      key: "usage",
      header: "Usos",
      render: (row: Coupon) => (
        <span className="text-sm">
          {row.used}/{row.max_uses > 0 ? row.max_uses : "∞"}
        </span>
      ),
    },
    {
      key: "validity",
      header: "Validade",
      render: (row: Coupon) => {
        if (!row.valid_from && !row.valid_to) return <span className="text-sm text-muted-foreground">Sem validade</span>;
        const from = row.valid_from ? new Date(row.valid_from).toLocaleDateString("pt-BR") : "—";
        const to = row.valid_to ? new Date(row.valid_to).toLocaleDateString("pt-BR") : "—";
        return <span className="text-xs">{from} → {to}</span>;
      },
    },
    {
      key: "active",
      header: "Status",
      render: (row: Coupon) => (
        <Badge
          variant="outline"
          className={`text-xs border-0 ${row.active ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}
        >
          {row.active ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row: Coupon) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(row)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Cupons</h1>
      </div>

      <Card className="rounded-2xl border-border bg-card">
        <CardContent className="pt-6">
          <DataTable
            columns={columns as any}
            data={filtered as unknown as Record<string, unknown>[]}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar cupons..."
            actions={
              <Button onClick={openCreate} size="sm">
                <Plus className="h-4 w-4 mr-2" /> Novo Cupom
              </Button>
            }
            emptyMessage="Nenhum cupom encontrado"
          />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Cupom" : "Novo Cupom"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coupon-code">Código</Label>
                <Input
                  id="coupon-code"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="NEX10"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.type} onValueChange={(v: string) => setForm((f) => ({ ...f, type: v as Coupon["type"] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percentual</SelectItem>
                    <SelectItem value="fixed">Valor fixo (centavos)</SelectItem>
                    <SelectItem value="freeshipping">Frete grátis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coupon-value">
                  {form.type === "percent" ? "Percentual (%)" : form.type === "fixed" ? "Valor (centavos)" : "Valor"}
                </Label>
                <Input
                  id="coupon-value"
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: parseInt(e.target.value) || 0 }))}
                  min={0}
                  disabled={form.type === "freeshipping"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coupon-min">Subtotal mínimo (centavos)</Label>
                <Input
                  id="coupon-min"
                  type="number"
                  value={form.minSubtotal}
                  onChange={(e) => setForm((f) => ({ ...f, minSubtotal: parseInt(e.target.value) || 0 }))}
                  min={0}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon-max">Limite de usos (0 = ilimitado)</Label>
              <Input
                id="coupon-max"
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm((f) => ({ ...f, maxUses: parseInt(e.target.value) || 0 }))}
                min={0}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coupon-from">Válido de</Label>
                <Input
                  id="coupon-from"
                  type="date"
                  value={form.validFrom}
                  onChange={(e) => setForm((f) => ({ ...f, validFrom: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coupon-to">Válido até</Label>
                <Input
                  id="coupon-to"
                  type="date"
                  value={form.validTo}
                  onChange={(e) => setForm((f) => ({ ...f, validTo: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.active}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, active: checked }))}
              />
              <Label>Ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Salvando..." : editing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Excluir cupom"
        description={`Tem certeza que deseja excluir o cupom "${deleteTarget?.code}"?`}
        confirmLabel="Excluir"
        destructive
        onConfirm={handleDelete}
        loading={isPending}
      />
    </div>
  );
}
