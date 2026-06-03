/**
 * Promote a user to admin role.
 *
 *   npx tsx scripts/promote-admin.ts user@email.com
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
import ws from "ws";
import { createClient } from "@supabase/supabase-js";

(globalThis as any).WebSocket ??= ws;

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!URL || !KEY) throw new Error("Missing Supabase env vars");

const supabase = createClient(URL, KEY, { auth: { persistSession: false } });

const email = process.argv[2];
if (!email) {
  console.error("Usage: npx tsx scripts/promote-admin.ts user@email.com");
  process.exit(1);
}

async function main() {
  // Find user by email
  const { data: users, error: listError } =
    await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) throw listError;

  const user = users.users.find((u) => u.email === email);
  if (!user) {
    console.error(`User not found: ${email}`);
    process.exit(1);
  }

  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { ...user.app_metadata, role: "admin" },
  });
  if (error) throw error;

  console.log(`✓ ${email} promoted to admin (user_id: ${user.id})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
