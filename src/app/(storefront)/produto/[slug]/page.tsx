import { notFound } from "next/navigation"
import { getProductBySlug, getCategoryBySlug } from "@/lib/db/queries/storefront"
import { ProductPageClient } from "@/components/storefront/product-page-client"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const category = await getCategoryBySlug(product.category)

  return <ProductPageClient product={product} category={category} />
}
