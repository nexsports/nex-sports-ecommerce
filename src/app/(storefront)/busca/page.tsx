import { searchProducts } from "@/lib/db/queries/storefront"
import { SearchPageClient } from "@/components/storefront/search-page-client"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q: query = "" } = await searchParams
  const results = query ? await searchProducts(query) : []

  return <SearchPageClient query={query} results={results} />
}
