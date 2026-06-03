"use server";

import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { requireAdmin } from "@/lib/auth/admin";
import { auditLog } from "@/lib/auth/audit";
import { revalidatePath } from "next/cache";

export async function getStaffUsers() {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, email, name, role, created_at")
    .in("role", ["staff", "admin"])
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateUserRole(userId: string, newRole: "admin" | "staff") {
  const user = await requireAdmin();

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    app_metadata: { role: newRole },
  });

  if (error) throw new Error(error.message);

  // Also update the users table
  await supabaseAdmin.from("users").update({ role: newRole }).eq("id", userId);

  await auditLog({
    userId: user.id,
    action: "update_role",
    entity: "user",
    entityId: userId,
    diff: { newRole },
  });

  revalidatePath("/admin/usuarios");
}
