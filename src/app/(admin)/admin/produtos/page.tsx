import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { ProductsTable } from "./products-table";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Produtos — NEX Admin" };

async function getProducts() {
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("id, title, slug, status, base_price, brand, category_id, seo_title")
    .order("created_at", { ascending: false });

  const { data: categories } = await supabaseAdmin
    .from("categories")
    .select("id, name")
    .order("position");

  const { data: images } = await supabaseAdmin
    .from("product_images")
    .select("product_id, url, position")
    .order("position");

  const { data: variants } = await supabaseAdmin
    .from("product_variants")
    .select("product_id, stock");

  // Build lookup maps
  const catMap = new Map((categories ?? []).map((c) => [c.id, c.name]));
  const imgMap = new Map<string, string>();
  for (const img of images ?? []) {
    if (!imgMap.has(img.product_id)) {
      imgMap.set(img.product_id, img.url);
    }
  }
  const stockMap = new Map<string, number>();
  for (const v of variants ?? []) {
    stockMap.set(v.product_id, (stockMap.get(v.product_id) ?? 0) + (v.stock ?? 0));
  }

  const rows = (products ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    status: p.status,
    basePrice: p.base_price,
    brand: p.brand,
    categoryName: catMap.get(p.category_id) ?? null,
    thumbUrl: imgMap.get(p.id) ?? null,
    totalStock: stockMap.get(p.id) ?? 0,
  }));

  return {
    products: rows,
    categories: categories ?? [],
  };
}

export default async function ProdutosPage() {
  const { products, categories } = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Package className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} produto{products.length !== 1 ? "s" : ""} cadastrado{products.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <ProductsTable products={products} categories={categories} />
    </div>
  );
}
