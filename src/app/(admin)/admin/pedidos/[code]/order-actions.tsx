"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  markPreparing,
  markShipped,
  markDelivered,
  markCancelled,
  updateNotes,
} from "../actions";
import { Truck, PackageCheck, CheckCircle2, XCircle, Save } from "lucide-react";

interface Props {
  orderId: string;
  orderCode: string;
  currentStatus: string;
  currentNotes: string;
}

export function OrderActions({ orderId, orderCode, currentStatus, currentNotes }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [shipOpen, setShipOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [notes, setNotes] = useState(currentNotes ?? "");
  const [notesSaved, setNotesSaved] = useState(false);
  const [tracking, setTracking] = useState({ trackingCode: "", carrier: "", service: "" });

  function handlePreparing() {
    setError(null);
    startTransition(async () => {
      const res = await markPreparing(orderId, orderCode);
      if (res.error) setError(res.error);
    });
  }

  function handleShip() {
    setError(null);
    startTransition(async () => {
      const res = await markShipped(orderId, orderCode, tracking);
      if (res.error) {
        setError(res.error);
      } else {
        setShipOpen(false);
        setTracking({ trackingCode: "", carrier: "", service: "" });
      }
    });
  }

  function handleDelivered() {
    setError(null);
    startTransition(async () => {
      const res = await markDelivered(orderId, orderCode);
      if (res.error) setError(res.error);
    });
  }

  function handleCancel() {
    setError(null);
    startTransition(async () => {
      const res = await markCancelled(orderId, orderCode);
      if (res.error) setError(res.error);
      else setCancelOpen(false);
    });
  }

  function handleSaveNotes() {
    startTransition(async () => {
      const res = await updateNotes(orderId, notes);
      if (!res.error) {
        setNotesSaved(true);
        setTimeout(() => setNotesSaved(false), 2000);
      }
    });
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-2">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {currentStatus === "paid" && (
          <Button size="sm" onClick={handlePreparing} disabled={isPending}>
            <Truck className="h-4 w-4 mr-1.5" /> Preparando
          </Button>
        )}
        {(currentStatus === "paid" || currentStatus === "preparing") && (
          <Button size="sm" onClick={() => setShipOpen(true)} disabled={isPending}>
            <PackageCheck className="h-4 w-4 mr-1.5" /> Enviar
          </Button>
        )}
        {currentStatus === "shipped" && (
          <Button size="sm" onClick={handleDelivered} disabled={isPending}>
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Entregue
          </Button>
        )}
        {!["delivered", "cancelled", "refunded"].includes(currentStatus) && (
          <Button size="sm" variant="destructive" onClick={() => setCancelOpen(true)} disabled={isPending}>
            <XCircle className="h-4 w-4 mr-1.5" /> Cancelar
          </Button>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Notas internas</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="bg-secondary border-border text-sm resize-none"
          placeholder="Observações internas sobre o pedido..."
        />
        <Button size="sm" variant="outline" onClick={handleSaveNotes} disabled={isPending}>
          <Save className="h-3.5 w-3.5 mr-1.5" />
          {notesSaved ? "Salvo!" : "Salvar notas"}
        </Button>
      </div>

      {/* Ship dialog */}
      <Dialog open={shipOpen} onOpenChange={setShipOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Marcar como enviado</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Código de rastreio *</Label>
              <Input
                value={tracking.trackingCode}
                onChange={(e) => setTracking((t) => ({ ...t, trackingCode: e.target.value }))}
                className="bg-secondary border-border"
                placeholder="BR123456789"
              />
            </div>
            <div>
              <Label className="text-xs">Transportadora *</Label>
              <Input
                value={tracking.carrier}
                onChange={(e) => setTracking((t) => ({ ...t, carrier: e.target.value }))}
                className="bg-secondary border-border"
                placeholder="Correios, Jadlog..."
              />
            </div>
            <div>
              <Label className="text-xs">Serviço</Label>
              <Input
                value={tracking.service}
                onChange={(e) => setTracking((t) => ({ ...t, service: e.target.value }))}
                className="bg-secondary border-border"
                placeholder="SEDEX, PAC..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShipOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button onClick={handleShip} disabled={isPending || !tracking.trackingCode || !tracking.carrier}>
              {isPending ? "Processando..." : "Confirmar envio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel confirm */}
      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancelar pedido"
        description={`Tem certeza que deseja cancelar o pedido ${orderCode}? Esta ação não pode ser desfeita.`}
        confirmLabel="Sim, cancelar"
        destructive
        onConfirm={handleCancel}
        loading={isPending}
      />
    </div>
  );
}
