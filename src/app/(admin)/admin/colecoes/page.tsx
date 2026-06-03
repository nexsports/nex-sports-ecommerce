import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { ColecoesClient } from "./colecoes-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Coleções — NEX Admin" };

async function getCollections() {
  const { data } = await supabaseAdmin
    .from("collections")
    .select("id, name, slug, type, position, active, created_at")
    .order("position");

  // Get product counts per collection
  const { data: counts } = await supabaseAdmin
    .from("collection_products")
    .select("collection_id");

  const countMap: Record<string, number> = {};
  for (const cp of counts ?? []) {
    countMap[cp.collection_id] = (countMap[cp.collection_id] ?? 0) + 1;
  }

  return (data ?? []).map((c) => ({
    ...c,
    productCount: countMap[c.id] ?? 0,
  }));
}

export default async function ColecoesPage() {
  const collections = await getCollections();
  return <ColecoesClient initialCollections={collections} />;
}
