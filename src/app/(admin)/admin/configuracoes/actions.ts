"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { requireAdmin } from "@/lib/auth/admin";
import { auditLog } from "@/lib/auth/audit";
import { revalidatePath } from "next/cache";

export async function getSettings(): Promise<Record<string, unknown>> {
  const { data } = await supabaseAdmin.from("settings").select("key, value");
  const map: Record<string, unknown> = {};
  for (const row of data ?? []) {
    map[row.key] = row.value;
  }
  return map;
}

export async function saveSettings(formData: FormData) {
  const user = await requireAdmin();

  const storeName = formData.get("store.name") as string;
  const storeEmail = formData.get("store.email") as string;
  const storePhone = formData.get("store.phone") as string;
  const storeAddress = formData.get("store.address") as string;
  const storeCnpj = formData.get("store.cnpj") as string;
  const socialInstagram = formData.get("social.instagram") as string;
  const socialTiktok = formData.get("social.tiktok") as string;

  const rows = [
    { key: "store.name", value: { value: storeName } },
    { key: "store.email", value: { value: storeEmail } },
    { key: "store.phone", value: { value: storePhone } },
    { key: "store.address", value: { value: storeAddress } },
    { key: "store.cnpj", value: { value: storeCnpj } },
    { key: "social.instagram", value: { value: socialInstagram } },
    { key: "social.tiktok", value: { value: socialTiktok } },
  ];

  for (const row of rows) {
    const { error } = await supabaseAdmin
      .from("settings")
      .upsert({ key: row.key, value: row.value }, { onConflict: "key" });
    if (error) throw new Error(error.message);
  }

  await auditLog({ userId: user.id, action: "update", entity: "settings", diff: { keys: rows.map((r) => r.key) } });
  revalidatePath("/admin/configuracoes");
}
