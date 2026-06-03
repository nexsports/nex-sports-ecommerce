"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { requireAdmin } from "@/lib/auth/admin";
import { auditLog } from "@/lib/auth/audit";
import { revalidatePath } from "next/cache";

const couponSchema = z.object({
  code: z.string().min(1, "Código obrigatório").max(50).transform((v) => v.toUpperCase()),
  type: z.enum(["percent", "fixed", "freeshipping"]),
  value: z.coerce.number().int().min(0),
  minSubtotal: z.coerce.number().int().min(0),
  maxUses: z.coerce.number().int().min(0),
  validFrom: z.string().optional().or(z.literal("")),
  validTo: z.string().optional().or(z.literal("")),
  active: z.coerce.boolean(),
});

export async function createCoupon(formData: FormData) {
  const user = await requireAdmin();
  const parsed = couponSchema.parse({
    code: formData.get("code"),
    type: formData.get("type"),
    value: formData.get("value"),
    minSubtotal: formData.get("minSubtotal") ?? 0,
    maxUses: formData.get("maxUses") ?? 0,
    validFrom: formData.get("validFrom") || "",
    validTo: formData.get("validTo") || "",
    active: formData.get("active") === "true",
  });

  const { data, error } = await supabaseAdmin
    .from("coupons")
    .insert({
      code: parsed.code,
      type: parsed.type,
      value: parsed.value,
      min_subtotal: parsed.minSubtotal,
      max_uses: parsed.maxUses,
      valid_from: parsed.validFrom || null,
      valid_to: parsed.validTo || null,
      active: parsed.active,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await auditLog({ userId: user.id, action: "create", entity: "coupon", entityId: data.id, diff: parsed as Record<string, unknown> });
  revalidatePath("/admin/cupons");
}

export async function updateCoupon(id: string, formData: FormData) {
  const user = await requireAdmin();
  const parsed = couponSchema.parse({
    code: formData.get("code"),
    type: formData.get("type"),
    value: formData.get("value"),
    minSubtotal: formData.get("minSubtotal") ?? 0,
    maxUses: formData.get("maxUses") ?? 0,
    validFrom: formData.get("validFrom") || "",
    validTo: formData.get("validTo") || "",
    active: formData.get("active") === "true",
  });

  const { error } = await supabaseAdmin
    .from("coupons")
    .update({
      code: parsed.code,
      type: parsed.type,
      value: parsed.value,
      min_subtotal: parsed.minSubtotal,
      max_uses: parsed.maxUses,
      valid_from: parsed.validFrom || null,
      valid_to: parsed.validTo || null,
      active: parsed.active,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await auditLog({ userId: user.id, action: "update", entity: "coupon", entityId: id, diff: parsed as Record<string, unknown> });
  revalidatePath("/admin/cupons");
}

export async function deleteCoupon(id: string) {
  const user = await requireAdmin();

  const { error } = await supabaseAdmin.from("coupons").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await auditLog({ userId: user.id, action: "delete", entity: "coupon", entityId: id });
  revalidatePath("/admin/cupons");
}
