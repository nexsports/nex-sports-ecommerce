import { createClient } from "@supabase/supabase-js";

export interface ActivityLogEntry {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function subscribeAdminActivity(
  callback: (entry: ActivityLogEntry) => void,
) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const channel = supabase
    .channel("admin-activity")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "activity_logs",
      },
      (payload) => {
        callback(payload.new as ActivityLogEntry);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
