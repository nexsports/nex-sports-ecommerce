import { db } from "@/lib/db/client"
import {
  categories,
  products,
  productImages,
  productVariants,
} from "@/lib/db/schema"
import { eq, desc, ilike, and, sql, inArray } from "drizzle-orm"
import { unstable_cache } from "next/cache"
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
  basePrice: number
  salePrice: number | null
  ratingAvg: string | null
  ratingCount: number
  salesCount: number
  categorySlug: string | null
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
}

function rowToProduct(row: ProductRow): Product {
  const sizes = row.sizes.length > 0 ? row.sizes : ["Único"]
  const colors =
    row.colors.length > 0
      ? row.colors.map((c) => ({ name: c, hex: "#334155" }))
      : [{ name: "Padrão", hex: "#334155" }]

  const images = row.images.length >= 3
    ? (row.images.slice(0, 3) as [string, string, string])
    : ([
      row.images[0] ?? "/no-image.svg",
      row.images[1] ?? row.images[0] ?? "/no-image.svg",
      row.images[2] ?? row.images[0] ?? "/no-image.svg",
    ] as [string, string, string])

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    brand: row.brand ?? "NEX",
    category: row.categorySlug ?? "",
    priceCents: row.basePrice,
    salePriceCents: row.salePrice ?? undefined,
    images,
    rating: Number(row.ratingAvg ?? 0),
    reviewCount: row.ratingCount,
    sizes,
    colors,
    description: row.description ?? "",
    stock: row.stock,
  }
}

/* ------------------------------------------------------------------ */
/* Categories                                                         */
/* ------------------------------------------------------------------ */

export const getActiveCategories = unstable_cache(
  async (): Promise<Category[]> => {
    try {
      const rows = await db
        .select({
          id: categories.id,
          slug: categories.slug,
          name: categories.name,
          description: categories.seoDescription,
          imageUrl: categories.imageUrl,
          productCount: sql<number>`count(${products.id})::int`,
        })
        .from(categories)
        .leftJoin(
          products,
          and(
            eq(products.categoryId, categories.id),
            eq(products.status, "active")
          )
        )
        .groupBy(categories.id)
        .orderBy(categories.position)

      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        description: r.description ?? r.name,
        imageUrl: r.imageUrl ?? "/no-image.svg",
        productCount: r.productCount,
      }))
    } catch {
      return []
    }
  },
  ["storefront-categories"],
  { tags: ["categories"], revalidate: 60 }
)

/* ------------------------------------------------------------------ */
/* Products by category                                               */
/* ------------------------------------------------------------------ */

export const getProductsByCategory = unstable_cache(
  async (categorySlug: string): Promise<Product[]> => {
    try {
      const rows = await db
        .select({
          id: products.id,
          slug: products.slug,
          title: products.title,
          description: products.description,
          brand: products.brand,
          basePrice: products.basePrice,
          salePrice: products.salePrice,
          ratingAvg: products.ratingAvg,
          ratingCount: products.ratingCount,
          salesCount: products.salesCount,
          categorySlug: categories.slug,
          images: sql<string[]>`coalesce(array_agg(distinct ${productImages.url} order by ${productImages.position}) filter (where ${productImages.url} is not null), '{}')`,
          sizes: sql<string[]>`coalesce(array_agg(distinct ${productVariants.size}) filter (where ${productVariants.size} is not null), '{}')`,
          colors: sql<string[]>`coalesce(array_agg(distinct ${productVariants.color}) filter (where ${productVariants.color} is not null), '{}')`,
          stock: sql<number>`coalesce(sum(${productVariants.stock}), 0)::int`,
        })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(productImages, eq(productImages.productId, products.id))
        .leftJoin(productVariants, eq(productVariants.productId, products.id))
        .where(
          and(eq(categories.slug, categorySlug), eq(products.status, "active"))
        )
        .groupBy(products.id, categories.slug)
        .orderBy(desc(products.salesCount))

      return rows.map(rowToProduct)
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
      const rows = await db
        .select({
          id: products.id,
          slug: products.slug,
          title: products.title,
          description: products.description,
          brand: products.brand,
          basePrice: products.basePrice,
          salePrice: products.salePrice,
          ratingAvg: products.ratingAvg,
          ratingCount: products.ratingCount,
          salesCount: products.salesCount,
          categorySlug: categories.slug,
          images: sql<string[]>`coalesce(array_agg(distinct ${productImages.url} order by ${productImages.position}) filter (where ${productImages.url} is not null), '{}')`,
          sizes: sql<string[]>`coalesce(array_agg(distinct ${productVariants.size}) filter (where ${productVariants.size} is not null), '{}')`,
          colors: sql<string[]>`coalesce(array_agg(distinct ${productVariants.color}) filter (where ${productVariants.color} is not null), '{}')`,
          stock: sql<number>`coalesce(sum(${productVariants.stock}), 0)::int`,
        })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(productImages, eq(productImages.productId, products.id))
        .leftJoin(productVariants, eq(productVariants.productId, products.id))
        .where(eq(products.status, "active"))
        .groupBy(products.id, categories.slug)
        .orderBy(desc(products.salesCount), desc(products.createdAt))
        .limit(limit)

      return rows.map(rowToProduct)
    } catch {
      return []
    }
  },
  ["storefront-bestsellers"],
  { tags: ["products"], revalidate: 60 }
)

/* ------------------------------------------------------------------ */
/* Single product by slug                                             */
/* ------------------------------------------------------------------ */

export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    try {
      const rows = await db
        .select({
          id: products.id,
          slug: products.slug,
          title: products.title,
          description: products.description,
          brand: products.brand,
          basePrice: products.basePrice,
          salePrice: products.salePrice,
          ratingAvg: products.ratingAvg,
          ratingCount: products.ratingCount,
          salesCount: products.salesCount,
          categorySlug: categories.slug,
          images: sql<string[]>`coalesce(array_agg(distinct ${productImages.url} order by ${productImages.position}) filter (where ${productImages.url} is not null), '{}')`,
          sizes: sql<string[]>`coalesce(array_agg(distinct ${productVariants.size}) filter (where ${productVariants.size} is not null), '{}')`,
          colors: sql<string[]>`coalesce(array_agg(distinct ${productVariants.color}) filter (where ${productVariants.color} is not null), '{}')`,
          stock: sql<number>`coalesce(sum(${productVariants.stock}), 0)::int`,
        })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(productImages, eq(productImages.productId, products.id))
        .leftJoin(productVariants, eq(productVariants.productId, products.id))
        .where(and(eq(products.slug, slug), eq(products.status, "active")))
        .groupBy(products.id, categories.slug)
        .limit(1)

      return rows[0] ? rowToProduct(rows[0]) : null
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
      const rows = await db
        .select({
          id: products.id,
          slug: products.slug,
          title: products.title,
          description: products.description,
          brand: products.brand,
          basePrice: products.basePrice,
          salePrice: products.salePrice,
          ratingAvg: products.ratingAvg,
          ratingCount: products.ratingCount,
          salesCount: products.salesCount,
          categorySlug: categories.slug,
          images: sql<string[]>`coalesce(array_agg(distinct ${productImages.url} order by ${productImages.position}) filter (where ${productImages.url} is not null), '{}')`,
          sizes: sql<string[]>`coalesce(array_agg(distinct ${productVariants.size}) filter (where ${productVariants.size} is not null), '{}')`,
          colors: sql<string[]>`coalesce(array_agg(distinct ${productVariants.color}) filter (where ${productVariants.color} is not null), '{}')`,
          stock: sql<number>`coalesce(sum(${productVariants.stock}), 0)::int`,
        })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(productImages, eq(productImages.productId, products.id))
        .leftJoin(productVariants, eq(productVariants.productId, products.id))
        .where(
          and(
            eq(products.status, "active"),
            sql`${products.salePrice} is not null`
          )
        )
        .groupBy(products.id, categories.slug)
        .limit(8)

      return rows.map(rowToProduct)
    } catch {
      return []
    }
  },
  ["storefront-featured"],
  { tags: ["products"], revalidate: 60 }
)

/* ------------------------------------------------------------------ */
/* Partners (from settings or fallback)                               */
/* ------------------------------------------------------------------ */

export const getPartners = unstable_cache(
  async (): Promise<Partner[]> => {
    try {
      const { settings } = await import("@/lib/db/schema")
      const row = await db
        .select({ value: settings.value })
        .from(settings)
        .where(eq(settings.key, "partners"))
        .limit(1)

      if (row[0]?.value && Array.isArray(row[0].value)) {
        return row[0].value as Partner[]
      }
    } catch {
      // settings table may not exist yet
    }

    // Fallback: static partners
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
/* Category by slug (for breadcrumb / metadata)                       */
/* ------------------------------------------------------------------ */

export const getCategoryBySlug = unstable_cache(
  async (slug: string): Promise<Category | null> => {
    try {
      const rows = await db
        .select({
          id: categories.id,
          slug: categories.slug,
          name: categories.name,
          description: categories.seoDescription,
          imageUrl: categories.imageUrl,
          productCount: sql<number>`count(${products.id})::int`,
        })
        .from(categories)
        .leftJoin(
          products,
          and(
            eq(products.categoryId, categories.id),
            eq(products.status, "active")
          )
        )
        .where(eq(categories.slug, slug))
        .groupBy(categories.id)
        .limit(1)

      if (!rows[0]) return null
      const r = rows[0]
      return {
        id: r.id,
        slug: r.slug,
        name: r.name,
        description: r.description ?? r.name,
        imageUrl: r.imageUrl ?? "/no-image.svg",
        productCount: r.productCount,
      }
    } catch {
      return null
    }
  },
  ["storefront-category-by-slug"],
  { tags: ["categories"], revalidate: 60 }
)

/* ------------------------------------------------------------------ */
/* Search                                                             */
/* ------------------------------------------------------------------ */

export const searchProducts = unstable_cache(
  async (query: string): Promise<Product[]> => {
    try {
      const pattern = `%${query}%`
      const rows = await db
        .select({
          id: products.id,
          slug: products.slug,
          title: products.title,
          description: products.description,
          brand: products.brand,
          basePrice: products.basePrice,
          salePrice: products.salePrice,
          ratingAvg: products.ratingAvg,
          ratingCount: products.ratingCount,
          salesCount: products.salesCount,
          categorySlug: categories.slug,
          images: sql<string[]>`coalesce(array_agg(distinct ${productImages.url} order by ${productImages.position}) filter (where ${productImages.url} is not null), '{}')`,
          sizes: sql<string[]>`coalesce(array_agg(distinct ${productVariants.size}) filter (where ${productVariants.size} is not null), '{}')`,
          colors: sql<string[]>`coalesce(array_agg(distinct ${productVariants.color}) filter (where ${productVariants.color} is not null), '{}')`,
          stock: sql<number>`coalesce(sum(${productVariants.stock}), 0)::int`,
        })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(productImages, eq(productImages.productId, products.id))
        .leftJoin(productVariants, eq(productVariants.productId, products.id))
        .where(
          and(
            eq(products.status, "active"),
            sql`(${products.title} ilike ${pattern} or ${products.brand} ilike ${pattern} or ${categories.name} ilike ${pattern} or ${categories.slug} ilike ${pattern})`
          )
        )
        .groupBy(products.id, categories.slug)
        .orderBy(desc(products.salesCount))
        .limit(50)

      return rows.map(rowToProduct)
    } catch {
      return []
    }
  },
  ["storefront-search"],
  { tags: ["products"], revalidate: 60 }
)
