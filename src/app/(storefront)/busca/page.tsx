"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Breadcrumb } from "@/components/storefront/breadcrumb"
import { ProductGrid } from "@/components/storefront/product-grid"
import { searchProducts } from "@/lib/data/catalog"
import { useRouter } from "next/navigation"

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") ?? ""
  const results = query ? searchProducts(query) : []

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <Breadcrumb items={[{ label: "Busca" }]} />

      <div className="mt-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Buscar produtos</h1>
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por produto, marca ou esporte..."
            defaultValue={query}
            className="pl-10"
            onChange={(e) => {
              const val = e.target.value
              if (val) {
                router.replace(`/busca?q=${encodeURIComponent(val)}`, { scroll: false })
              } else {
                router.replace("/busca", { scroll: false })
              }
            }}
            aria-label="Buscar produtos"
          />
        </div>
      </div>

      {query && (
        <p className="text-sm text-muted-foreground mb-6">
          {results.length} resultado{results.length !== 1 ? "s" : ""} para &quot;{query}&quot;
        </p>
      )}

      {results.length > 0 ? (
        <ProductGrid products={results} />
      ) : query ? (
        <div className="text-center py-24">
          <Search className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-1">Nenhum resultado</h2>
          <p className="text-muted-foreground text-sm">Tente buscar por outro termo.</p>
        </div>
      ) : (
        <div className="text-center py-24">
          <Search className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-1">Digite algo para buscar</h2>
          <p className="text-muted-foreground text-sm">Busque por produto, marca ou esporte.</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-24 text-center text-muted-foreground">Carregando...</div>}>
      <SearchContent />
    </Suspense>
  )
}
