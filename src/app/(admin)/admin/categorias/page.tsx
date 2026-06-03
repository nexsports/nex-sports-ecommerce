import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { CategoriasClient } from "./categorias-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categorias — NEX Admin" };

async function getCategories() {
  const { data } = await supabaseAdmin
    .from("categories")
    .select("id, name, slug, image_url, position, seo_title, seo_description, created_at")
    .order("position");

  // Get product counts per category
  const { data: counts } = await supabaseAdmin
    .from("products")
    .select("category_id");

  const countMap: Record<string, number> = {};
  for (const p of counts ?? []) {
    if (p.category_id) {
      countMap[p.category_id] = (countMap[p.category_id] ?? 0) + 1;
    }
  }

  return (data ?? []).map((c) => ({
    ...c,
    productCount: countMap[c.id] ?? 0,
  }));
}

export default async function CategoriasPage() {
  const categories = await getCategories();
  return <CategoriasClient initialCategories={categories} />;
}
