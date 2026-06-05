"use server";

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

const SETTINGS_KEYS = [
  "store.name", "store.email", "store.phone", "store.address", "store.cnpj", "store.description",
  "social.instagram", "social.tiktok", "social.whatsapp",
  "shipping.free_threshold", "shipping.default_rate",
  "payment.mp_public_key", "payment.mp_access_token",
  "pix.banner_title", "pix.banner_body", "pix.banner_cta",
  "newsletter.title", "newsletter.subtitle", "newsletter.cta",
  "seo.default_title", "seo.default_description", "seo.og_image",
];

export async function saveSettings(formData: FormData) {
  const user = await requireAdmin();

  const rows = SETTINGS_KEYS
    .filter((key) => formData.has(key))
    .map((key) => ({ key, value: { value: formData.get(key) as string } }));

  for (const row of rows) {
    const { error } = await supabaseAdmin
      .from("settings")
      .upsert({ key: row.key, value: row.value }, { onConflict: "key" });
    if (error) throw new Error(error.message);
  }

  await auditLog({ userId: user.id, action: "update", entity: "settings", diff: { keys: rows.map((r) => r.key) } });
  revalidatePath("/admin/configuracoes");
}
