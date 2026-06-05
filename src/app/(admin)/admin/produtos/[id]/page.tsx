import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { ProductForm } from "../product-form";

export const metadata = { title: "Editar Produto — NEX Admin" };

async function getProduct(id: string) {
  const { data: product } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) return null;

  const { data: images } = await supabaseAdmin
    .from("product_images")
    .select("id, url, alt, position")
    .eq("product_id", id)
    .order("position");

  const { data: variants } = await supabaseAdmin
    .from("product_variants")
    .select("id, size, color, stock, sku")
    .eq("product_id", id);

  const { data: categories } = await supabaseAdmin
    .from("categories")
    .select("id, name")
    .order("position");

  return {
    product,
    images: (images ?? []).map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt ?? "",
      position: img.position,
    })),
    variants: (variants ?? []).map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      stock: v.stock,
      sku: v.sku,
    })),
    categories: categories ?? [],
  };
}

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProduct(id);

  if (!result) {
    notFound();
  }

  const { product, images, variants, categories } = result;

  return (
    <ProductForm
      mode="edit"
      categories={categories}
      productId={product.id}
      initialData={{
        title: product.title,
        slug: product.slug,
        brand: product.brand ?? "",
        description: product.description ?? "",
        categoryId: product.category_id,
        status: product.status,
        basePrice: product.base_price,
        salePrice: product.sale_price,
        skuRoot: product.sku_root ?? "",
        seoTitle: product.seo_title ?? "",
        seoDescription: product.seo_description ?? "",
        gender: product.gender ?? "",
        badge: product.badge ?? "",
        images,
        variants,
      }}
    />
  );
}
