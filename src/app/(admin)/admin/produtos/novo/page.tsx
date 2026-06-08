import { createClient } from "@supabase/supabase-js";
import { ProductForm } from "../product-form";

export const metadata = { title: "Novo Produto — NEX Admin" };
export const dynamic = "force-dynamic";

async function getCategories() {
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
    const { data, error } = await sb.from("categories").select("id, name").order("position");
    if (error) { console.error("[novo] cats", error); return []; }
    return data ?? [];
  } catch (e) {
    console.error("[novo] fetch err", e);
    return [];
  }
}

export default async function NovoProdutoPage() {
  const categories = await getCategories();
  return <ProductForm mode="create" categories={categories} />;
}
