/**
 * Cria (ou atualiza) usuário admin com senha forçada.
 *   npx tsx scripts/create-admin.ts user@email.com [name]
 * Imprime a senha gerada no terminal — copie e guarde.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
import ws from "ws";
(globalThis as any).WebSocket ??= ws;
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!URL || !KEY) throw new Error("Missing Supabase env");

const supabase = createClient(URL, KEY, { auth: { persistSession: false } });

const email = process.argv[2];
const name = process.argv[3] ?? email?.split("@")[0] ?? "Admin";
if (!email) {
  console.error("Uso: npx tsx scripts/create-admin.ts user@email.com [name]");
  process.exit(1);
}

async function main() {
  const password = `Nex@${randomBytes(8).toString("base64url")}!`;
  const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const existing = list?.users.find((u) => u.email === email);

  let user: any;
  if (existing) {
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      app_metadata: { ...existing.app_metadata, role: "admin" },
      user_metadata: { ...existing.user_metadata, name },
      email_confirm: true,
    });
    if (error) throw error;
    user = data.user;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
      app_metadata: { role: "admin" },
    });
    if (error) throw error;
    user = data.user;
  }

  console.log("\n=========================================");
  console.log("✓ ADMIN CRIADO/ATUALIZADO");
  console.log("=========================================");
  console.log("Email:   ", user.email);
  console.log("Senha:   ", password);
  console.log("ID:      ", user.id);
  console.log("Role:    ", user.app_metadata?.role);
  console.log("=========================================");
  console.log("Login:   http://localhost:3000/admin/login");
}

main().catch((e) => { console.error("✗", e); process.exit(1); });
