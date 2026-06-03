import { supabaseAdmin } from "@/lib/supabase/admin-client";

export async function auditLog(params: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  diff?: Record<string, unknown>;
}) {
  await supabaseAdmin.from("admin_audit").insert({
    user_id: params.userId ?? null,
    action: params.action,
    entity: params.entity,
    entity_id: params.entityId ?? null,
    diff: params.diff ?? null,
  });
}
