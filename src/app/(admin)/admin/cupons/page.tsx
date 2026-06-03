import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { CuponsClient } from "./cupons-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Cupons — NEX Admin" };

async function getCoupons() {
  const { data } = await supabaseAdmin
    .from("coupons")
    .select("id, code, type, value, min_subtotal, max_uses, used, valid_from, valid_to, active, created_at")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function CuponsPage() {
  const coupons = await getCoupons();
  return <CuponsClient initialCoupons={coupons} />;
}
