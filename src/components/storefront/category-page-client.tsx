"use client"

import { useState, useMemo } from "react"
import { Breadcrumb } from "@/components/storefront/breadcrumb"
import { ProductCard } from "@/components/storefront/product-card"
import { PlpFiltersSidebar, PlpFiltersTrigger, type FilterState } from "@/components/storefront/plp-filters"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Product, Category } from "@/lib/mocks/types"

export function CategoryPageClient({
  category,
  products: allProducts,
}: {
  category: Category
  products: Product[]
}) {
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

  const [gender, setGender] = useState<"todos" | "masculino" | "feminino">("todos")

  const filteredByGender = useMemo(() => {
    if (gender === "todos") return allProducts
    return allProducts.filter((p) => p.gender === gender || p.gender === "unissex")
  }, [allProducts, gender])

  const filtered = useMemo(() => {
    let result = [...filteredByGender]

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
  }, [filteredByGender, filters])

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <Breadcrumb items={[{ label: category.name }]} />

      <div className="mt-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
        <p className="text-muted-foreground mt-1">{category.description}</p>
      </div>

      {/* Filter bar */}
      <div className="mt-6 mb-6 space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-4 lg:space-y-0">
        <div
          className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          <span className="shrink-0 text-[11px] uppercase tracking-wider text-muted-foreground mr-1">
            Gênero
          </span>
          {[
            { value: "todos" as const, label: "Todos" },
            { value: "masculino" as const, label: "Masculino" },
            { value: "feminino" as const, label: "Feminino" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setGender(opt.value)}
              className={cn(
                "shrink-0 px-4 h-10 rounded-full text-xs font-semibold transition-colors",
                gender === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/60 text-foreground/80 hover:bg-secondary"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
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
                  initial={false}
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
