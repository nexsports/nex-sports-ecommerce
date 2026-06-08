import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { ProductForm } from "../product-form";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata = { title: "Novo Produto — NEX Admin" };

async function getCategories() {
  try {
    const { data } = await supabaseAdmin
      .from("categories")
      .select("id, name")
      .order("position");
    return data ?? [];
  } catch (e) {
    console.error("[novo] failed to fetch categories", e);
    return [];
  }
}

export default async function NovoProdutoPage() {
  const categories = await getCategories();

  return <ProductForm mode="create" categories={categories} />;
}
