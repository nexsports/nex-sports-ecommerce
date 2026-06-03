import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { ConfiguracoesClient } from "./configuracoes-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Configurações — NEX Admin" };

async function getSettings() {
  const { data } = await supabaseAdmin.from("settings").select("key, value");
  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    // value is jsonb like { "value": "..." }
    map[row.key] = row.value?.value ?? "";
  }
  return map;
}

export default async function ConfiguracoesPage() {
  const settings = await getSettings();
  return <ConfiguracoesClient initialSettings={settings} />;
}
