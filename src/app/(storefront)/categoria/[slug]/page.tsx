import { notFound } from "next/navigation"
import { getCategoryBySlug, getProductsByCategory } from "@/lib/db/queries/storefront"
import { CategoryPageClient } from "@/components/storefront/category-page-client"

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug),
  ])

  if (!category) notFound()

  return <CategoryPageClient category={category} products={products} />
}
