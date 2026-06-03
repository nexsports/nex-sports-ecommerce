"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { requireAdmin } from "@/lib/auth/admin";
import { auditLog } from "@/lib/auth/audit";
import { revalidatePath } from "next/cache";

const shipSchema = z.object({
  trackingCode: z.string().min(1, "Código de rastreio obrigatório"),
  carrier: z.string().min(1, "Transportadora obrigatória"),
  service: z.string().optional(),
});

export async function markPreparing(orderId: string, orderCode: string) {
  const user = await requireAdmin();

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status: "preparing", updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return { error: error.message };

  await supabaseAdmin.from("order_events").insert({
    order_id: orderId,
    type: "status_changed",
    payload: { from: "paid", to: "preparing", by: user.id },
  });

  await auditLog({
    userId: user.id,
    action: "order.mark_preparing",
    entity: "orders",
    entityId: orderId,
  });

  revalidatePath(`/admin/pedidos/${orderCode}`);
  revalidatePath("/admin/pedidos");
  return { success: true };
}

export async function markShipped(
  orderId: string,
  orderCode: string,
  formData: { trackingCode: string; carrier: string; service?: string }
) {
  const user = await requireAdmin();

  const parsed = shipSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { trackingCode, carrier, service } = parsed.data;

  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      status: "shipped",
      tracking_code: trackingCode,
      shipping_carrier: carrier,
      shipping_service: service ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) return { error: error.message };

  await supabaseAdmin.from("order_events").insert({
    order_id: orderId,
    type: "status_changed",
    payload: { from: "preparing", to: "shipped", trackingCode, carrier, service, by: user.id },
  });

  await auditLog({
    userId: user.id,
    action: "order.mark_shipped",
    entity: "orders",
    entityId: orderId,
    diff: { trackingCode, carrier, service },
  });

  revalidatePath(`/admin/pedidos/${orderCode}`);
  revalidatePath("/admin/pedidos");
  return { success: true };
}

export async function markDelivered(orderId: string, orderCode: string) {
  const user = await requireAdmin();

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status: "delivered", updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return { error: error.message };

  await supabaseAdmin.from("order_events").insert({
    order_id: orderId,
    type: "status_changed",
    payload: { from: "shipped", to: "delivered", by: user.id },
  });

  await auditLog({
    userId: user.id,
    action: "order.mark_delivered",
    entity: "orders",
    entityId: orderId,
  });

  revalidatePath(`/admin/pedidos/${orderCode}`);
  revalidatePath("/admin/pedidos");
  return { success: true };
}

export async function markCancelled(orderId: string, orderCode: string) {
  const user = await requireAdmin();

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return { error: error.message };

  await supabaseAdmin.from("order_events").insert({
    order_id: orderId,
    type: "status_changed",
    payload: { to: "cancelled", by: user.id },
  });

  await auditLog({
    userId: user.id,
    action: "order.mark_cancelled",
    entity: "orders",
    entityId: orderId,
  });

  revalidatePath(`/admin/pedidos/${orderCode}`);
  revalidatePath("/admin/pedidos");
  return { success: true };
}

export async function updateNotes(orderId: string, notes: string) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ notes_internal: notes, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return { error: error.message };
  return { success: true };
}
