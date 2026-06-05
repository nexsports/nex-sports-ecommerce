"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Breadcrumb } from "@/components/storefront/breadcrumb"
import { ProductGrid } from "@/components/storefront/product-grid"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/mocks/types"

export function SearchPageClient({
  query,
  results,
}: {
  query: string
  results: Product[]
}) {
  const router = useRouter()

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <Breadcrumb items={[{ label: "Busca" }]} />

      {/* Sticky search on mobile */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm -mx-4 px-4 py-3 md:static md:bg-transparent md:backdrop-blur-none md:mx-0 md:px-0 md:py-0 mt-4 mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Buscar produtos</h1>
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Buscar por produto, marca ou esporte..."
            defaultValue={query}
            className="pl-10 h-11"
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
        <p className="text-sm text-muted-foreground mb-4 md:mb-6">
          {results.length} resultado{results.length !== 1 ? "s" : ""} para &quot;{query}&quot;
        </p>
      )}

      {results.length > 0 ? (
        <ProductGrid products={results} />
      ) : query ? (
        <div className="text-center py-16 md:py-24">
          <Search className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-1">Nenhum resultado</h2>
          <p className="text-muted-foreground text-sm mb-6">Tente buscar por outro termo.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Futebol", "Natação", "Corrida", "Academia"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => router.replace(`/busca?q=${encodeURIComponent(s)}`, { scroll: false })}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-border hover:bg-secondary/50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 md:py-24">
          <Search className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-1">Digite algo para buscar</h2>
          <p className="text-muted-foreground text-sm">Busque por produto, marca ou esporte.</p>
        </div>
      )}
    </div>
  )
}
