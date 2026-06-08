import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ProductForm } from "../product-form";

export const metadata = { title: "Editar Produto — NEX Admin" };
export const dynamic = "force-dynamic";

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = sb();

  const [{ data: prod, error: pErr }, { data: cats }, imgRes, attrRes, varRes] = await Promise.all([
    c.from("products")
      .select("id, title, slug, brand, description, category_id, status, base_price, sale_price, gender")
      .eq("id", id)
      .maybeSingle(),
    c.from("categories").select("id, name").order("position"),
    c.from("product_images").select("url, alt").eq("product_id", id).order("position"),
    c.from("product_attributes").select("name, value").eq("product_id", id).order("position"),
    c.from("product_variants").select("stock").eq("product_id", id),
  ]);
  if (pErr) { console.error("[edit] product err", pErr); }
  if (!prod) notFound();

  const totalStock = (varRes.data ?? []).reduce((s, v) => s + (v.stock ?? 0), 0);

  const initialData = {
    id: prod.id,
    title: prod.title,
    slug: prod.slug,
    brand: prod.brand,
    description: prod.description,
    categoryId: prod.category_id,
    status: (prod.status ?? "active") as "draft" | "active" | "archived",
    gender: (prod.gender ?? "unissex") as "masculino" | "feminino" | "unissex",
    basePriceCents: prod.base_price ?? 0,
    salePriceCents: prod.sale_price ?? null,
    stock: totalStock,
    images: (imgRes.data ?? []).map((i) => ({ url: i.url, alt: i.alt ?? "" })),
    attributes: (attrRes.data ?? []).map((a) => ({ name: a.name, value: a.value })),
  };
  return <ProductForm mode="edit" categories={cats ?? []} initialData={initialData} />;
}
