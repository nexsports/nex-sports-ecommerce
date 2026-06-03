"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { Breadcrumb } from "@/components/storefront/breadcrumb"
import { ProductCard } from "@/components/storefront/product-card"
import { PlpFiltersSidebar, PlpFiltersTrigger, type FilterState } from "@/components/storefront/plp-filters"
import { getProductsByCategory, getCategoryBySlug } from "@/lib/mocks/catalog"
import { motion } from "framer-motion"

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const category = getCategoryBySlug(slug)
  const allProducts = getProductsByCategory(slug)

  const availableSizes = useMemo(() => {
    const set = new Set<string>()
    allProducts.forEach((p) => p.sizes.forEach((s) => set.add(s)))
    return Array.from(set)
  }, [allProducts])

  const availableBrands = useMemo(() => {
    return Array.from(new Set(allProducts.map((p) => p.brand)))
  }, [allProducts])

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 0],
    sizes: [],
    brands: [],
    sort: "relevance",
  })

  const filtered = useMemo(() => {
    let result = [...allProducts]

    if (filters.priceRange[0] > 0) {
      result = result.filter((p) => (p.salePriceCents ?? p.priceCents) >= filters.priceRange[0] * 100)
    }
    if (filters.priceRange[1] > 0) {
      result = result.filter((p) => (p.salePriceCents ?? p.priceCents) <= filters.priceRange[1] * 100)
    }
    if (filters.sizes.length > 0) {
      result = result.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)))
    }
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand))
    }

    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => (a.salePriceCents ?? a.priceCents) - (b.salePriceCents ?? b.priceCents))
        break
      case "price-desc":
        result.sort((a, b) => (b.salePriceCents ?? b.priceCents) - (a.salePriceCents ?? a.priceCents))
        break
      case "bestseller":
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
    }

    return result
  }, [allProducts, filters])

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-2xl font-bold mb-2">Categoria não encontrada</h1>
        <p className="text-muted-foreground">Verifique a URL ou volte para a página inicial.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <Breadcrumb items={[{ label: category.name }]} />

      <div className="mt-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
        <p className="text-muted-foreground mt-1">{category.description}</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{filtered.length} produtos</p>
        <div className="lg:hidden">
          <PlpFiltersTrigger
            availableSizes={availableSizes}
            availableBrands={availableBrands}
            filters={filters}
            onChange={setFilters}
          />
        </div>
      </div>

      <div className="flex gap-8">
        <div className="hidden lg:block">
          <PlpFiltersSidebar
            availableSizes={availableSizes}
            availableBrands={availableBrands}
            filters={filters}
            onChange={setFilters}
          />
        </div>

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground">Nenhum produto encontrado com esses filtros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
