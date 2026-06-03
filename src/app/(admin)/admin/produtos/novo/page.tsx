import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { ProductForm } from "../product-form";

export const metadata = { title: "Novo Produto — NEX Admin" };

async function getCategories() {
  const { data } = await supabaseAdmin
    .from("categories")
    .select("id, name")
    .order("position");
  return data ?? [];
}

export default async function NovoProdutoPage() {
  const categories = await getCategories();

  return <ProductForm mode="create" categories={categories} />;
}
