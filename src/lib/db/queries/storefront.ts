import { unstable_cache } from "next/cache"
import { sbStorefront } from "@/lib/supabase/storefront-client"
import type { Product, Category, Partner } from "@/lib/mocks/types"

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

type ProductRow = {
  id: string
  slug: string
  title: string
  description: string | null
  brand: string | null
  base_price: number
  sale_price: number | null
  rating_avg: string | null
  rating_count: number
  sales_count: number
  status: string
  categories: { slug: string; name: string } | null
  product_images: { url: string; position: number }[]
  product_variants: { size: string | null; color: string | null; stock: number }[]
}

function rowToProduct(row: ProductRow): Product {
  const images = (row.product_images ?? [])
    .sort((a, b) => a.position - b.position)
    .map((i) => i.url)

  const variants = row.product_variants ?? []
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean) as string[])]
  const colorNames = [...new Set(variants.map((v) => v.color).filter(Boolean) as string[])]
  const stock = variants.reduce((sum, v) => sum + (v.stock ?? 0), 0)

  const sized = sizes.length > 0 ? sizes : ["Único"]
  const colored =
    colorNames.length > 0
      ? colorNames.map((c) => ({ name: c, hex: "#334155" }))
      : [{ name: "Padrão", hex: "#334155" }]

  const imgs = images.length >= 3
    ? (images.slice(0, 3) as [string, string, string])
    : ([
      images[0] ?? "/no-image.svg",
      images[1] ?? images[0] ?? "/no-image.svg",
      images[2] ?? images[0] ?? "/no-image.svg",
    ] as [string, string, string])

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    brand: row.brand ?? "NEX",
    category: row.categories?.slug ?? "",
    priceCents: row.base_price,
    salePriceCents: row.sale_price ?? undefined,
    images: imgs,
    rating: Number(row.rating_avg ?? 0),
    reviewCount: row.rating_count,
    sizes: sized,
    colors: colored,
    description: row.description ?? "",
    stock,
  }
}

const PRODUCT_SELECT =
  "id, slug, title, description, brand, base_price, sale_price, rating_avg, rating_count, sales_count, status, categories(slug, name), product_images(url, position), product_variants(size, color, stock)"

/* ------------------------------------------------------------------ */
/* Categories                                                         */
/* ------------------------------------------------------------------ */

export const getActiveCategories = unstable_cache(
  async (): Promise<Category[]> => {
    try {
      const sb = sbStorefront()
      const { data: cats, error } = await sb
        .from("categories")
        .select("id, slug, name, seo_description, image_url, position")
        .order("position")

      if (error || !cats) return []

      // Get product counts per category
      const { data: countRows } = await sb
        .from("products")
        .select("category_id")
        .eq("status", "active")

      const countMap = new Map<string, number>()
      for (const r of countRows ?? []) {
        countMap.set(r.category_id, (countMap.get(r.category_id) ?? 0) + 1)
      }

      return cats.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.seo_description ?? c.name,
        imageUrl: c.image_url ?? "/no-image.svg",
        productCount: countMap.get(c.id) ?? 0,
      }))
    } catch {
      return []
    }
  },
  ["storefront-categories"],
  { tags: ["categories"], revalidate: 60 }
)

/* ------------------------------------------------------------------ */
/* Category by slug                                                   */
/* ------------------------------------------------------------------ */

export const getCategoryBySlug = unstable_cache(
  async (slug: string): Promise<Category | null> => {
    try {
      const sb = sbStorefront()
      const { data, error } = await sb
        .from("categories")
        .select("id, slug, name, seo_description, image_url")
        .eq("slug", slug)
        .limit(1)
        .single()

      if (error || !data) return null

      const { count } = await sb
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("category_id", data.id)
        .eq("status", "active")

      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        description: data.seo_description ?? data.name,
        imageUrl: data.image_url ?? "/no-image.svg",
        productCount: count ?? 0,
      }
    } catch {
      return null
    }
  },
  ["storefront-category-by-slug"],
  { tags: ["categories"], revalidate: 60 }
)

/* ------------------------------------------------------------------ */
/* Products by category                                               */
/* ------------------------------------------------------------------ */

export const getProductsByCategory = unstable_cache(
  async (categorySlug: string): Promise<Product[]> => {
    try {
      const sb = sbStorefront()

      // Resolve category id from slug
      const { data: cat } = await sb
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .limit(1)
        .single()

      if (!cat) return []

      const { data, error } = await sb
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("status", "active")
        .eq("category_id", cat.id)
        .order("sales_count", { ascending: false })

      if (error || !data) return []
      return (data as unknown as ProductRow[]).map(rowToProduct)
    } catch {
      return []
    }
  },
  ["storefront-products-by-category"],
  { tags: ["products"], revalidate: 60 }
)

/* ------------------------------------------------------------------ */
/* Best sellers                                                       */
/* ------------------------------------------------------------------ */

export const getBestSellers = unstable_cache(
  async (limit = 4): Promise<Product[]> => {
    try {
      const sb = sbStorefront()
      const { data, error } = await sb
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("status", "active")
        .order("sales_count", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error || !data) return []
      return (data as unknown as ProductRow[]).map(rowToProduct)
    } catch {
      return []
    }
  },
  ["storefront-bestsellers"],
  { tags: ["products"], revalidate: 60 }
)

/* ------------------------------------------------------------------ */
/* Product by slug                                                    */
/* ------------------------------------------------------------------ */

export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    try {
      const sb = sbStorefront()
      const { data, error } = await sb
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("status", "active")
        .eq("slug", slug)
        .limit(1)
        .single()

      if (error || !data) return null
      return rowToProduct(data as unknown as ProductRow)
    } catch {
      return null
    }
  },
  ["storefront-product-by-slug"],
  { tags: ["products"], revalidate: 60 }
)

/* ------------------------------------------------------------------ */
/* Featured (on sale)                                                 */
/* ------------------------------------------------------------------ */

export const getFeatured = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      const sb = sbStorefront()
      const { data, error } = await sb
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("status", "active")
        .not("sale_price", "is", null)
        .limit(8)

      if (error || !data) return []
      return (data as unknown as ProductRow[]).map(rowToProduct)
    } catch {
      return []
    }
  },
  ["storefront-featured"],
  { tags: ["products"], revalidate: 60 }
)

/* ------------------------------------------------------------------ */
/* Partners                                                           */
/* ------------------------------------------------------------------ */

export const getPartners = unstable_cache(
  async (): Promise<Partner[]> => {
    try {
      const sb = sbStorefront()
      const { data } = await sb
        .from("settings")
        .select("value")
        .eq("key", "partners")
        .limit(1)
        .single()

      if (data?.value && Array.isArray(data.value)) {
        return data.value as Partner[]
      }
    } catch {
      // settings table may not exist
    }

    return [
      { name: "NIKE", logoUrl: "" },
      { name: "ADIDAS", logoUrl: "" },
      { name: "PUMA", logoUrl: "" },
      { name: "ASICS", logoUrl: "" },
      { name: "NEW BALANCE", logoUrl: "" },
      { name: "UNDER ARMOUR", logoUrl: "" },
      { name: "MIZUNO", logoUrl: "" },
      { name: "WILSON", logoUrl: "" },
    ]
  },
  ["storefront-partners"],
  { tags: ["partners"], revalidate: 300 }
)

/* ------------------------------------------------------------------ */
/* Search                                                             */
/* ------------------------------------------------------------------ */

export const searchProducts = unstable_cache(
  async (query: string): Promise<Product[]> => {
    try {
      const sb = sbStorefront()
      const pattern = `%${query}%`

      // Search by title or brand on products, then filter by status
      const { data, error } = await sb
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("status", "active")
        .or(`title.ilike.${pattern},brand.ilike.${pattern}`)
        .order("sales_count", { ascending: false })
        .limit(50)

      if (error || !data) return []

      // Also match by category name — fetch category matches separately
      const { data: catMatch } = await sb
        .from("categories")
        .select("id")
        .or(`name.ilike.${pattern},slug.ilike.${pattern}`)

      if (catMatch && catMatch.length > 0) {
        const catIds = catMatch.map((c) => c.id)
        const { data: catProducts } = await sb
          .from("products")
          .select(PRODUCT_SELECT)
          .eq("status", "active")
          .in("category_id", catIds)
          .order("sales_count", { ascending: false })
          .limit(50)

        if (catProducts) {
          const existingIds = new Set(data.map((p) => p.id))
          for (const p of catProducts) {
            if (!existingIds.has(p.id)) data.push(p)
          }
        }
      }

      return (data as unknown as ProductRow[]).map(rowToProduct)
    } catch {
      return []
    }
  },
  ["storefront-search"],
  { tags: ["products"], revalidate: 60 }
)
