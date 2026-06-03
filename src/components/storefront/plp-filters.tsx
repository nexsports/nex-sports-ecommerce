"use client"

import { useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export interface FilterState {
  priceRange: [number, number]
  sizes: string[]
  brands: string[]
  sort: string
}

interface PlpFiltersProps {
  availableSizes: string[]
  availableBrands: string[]
  filters: FilterState
  onChange: (filters: FilterState) => void
}

const sortOptions = [
  { value: "relevance", label: "Relevância" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "bestseller", label: "Mais vendidos" },
]

function FilterContent({ availableSizes, availableBrands, filters, onChange }: PlpFiltersProps) {
  const toggleSize = (s: string) => {
    const next = filters.sizes.includes(s)
      ? filters.sizes.filter((x) => x !== s)
      : [...filters.sizes, s]
    onChange({ ...filters, sizes: next })
  }

  const toggleBrand = (b: string) => {
    const next = filters.brands.includes(b)
      ? filters.brands.filter((x) => x !== b)
      : [...filters.brands, b]
    onChange({ ...filters, brands: next })
  }

  return (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <p className="text-sm font-semibold mb-3">Ordenar por</p>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, sort: opt.value })}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-all border",
                filters.sort === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-foreground border-transparent hover:border-muted-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price range */}
      <div>
        <p className="text-sm font-semibold mb-3">Faixa de preço</p>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceRange[0] || ""}
            onChange={(e) =>
              onChange({ ...filters, priceRange: [Number(e.target.value), filters.priceRange[1]] })
            }
            className="flex h-10 w-full rounded-xl border border-border bg-transparent px-3 py-2 text-sm"
            aria-label="Preço mínimo"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceRange[1] || ""}
            onChange={(e) =>
              onChange({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })
            }
            className="flex h-10 w-full rounded-xl border border-border bg-transparent px-3 py-2 text-sm"
            aria-label="Preço máximo"
          />
        </div>
      </div>

      <Separator />

      {/* Sizes */}
      {availableSizes.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-3">Tamanho</p>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((s) => (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className={cn(
                  "min-w-[2.5rem] h-9 px-2.5 rounded-lg text-sm transition-all border",
                  filters.sizes.includes(s)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-foreground border-transparent hover:border-muted-foreground"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Brands */}
      {availableBrands.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-3">Marca</p>
          <div className="flex flex-wrap gap-2">
            {availableBrands.map((b) => (
              <button
                key={b}
                onClick={() => toggleBrand(b)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm transition-all border",
                  filters.brands.includes(b)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-foreground border-transparent hover:border-muted-foreground"
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function hasActiveFilters(filters: FilterState) {
  return filters.sizes.length > 0 || filters.brands.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] > 0
}

export function PlpFiltersSidebar(props: PlpFiltersProps) {
  const { filters, onChange } = props

  return (
    <aside className="w-64 shrink-0">
      <div className="sticky top-20 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </h3>
          {hasActiveFilters(filters) && (
            <button
              onClick={() =>
                onChange({ priceRange: [0, 0], sizes: [], brands: [], sort: "relevance" })
              }
              className="text-xs text-accent hover:underline"
            >
              Limpar
            </button>
          )}
        </div>
        <FilterContent {...props} />
      </div>
    </aside>
  )
}

export function PlpFiltersTrigger(props: PlpFiltersProps) {
  const { filters, onChange } = props

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtros
          {hasActiveFilters(filters) && (
            <span className="ml-1 h-2 w-2 rounded-full bg-accent" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto h-[calc(100%-8rem)]">
          <FilterContent {...props} />
        </div>
        <div className="flex gap-3 pt-4 border-t border-border">
          {hasActiveFilters(filters) && (
            <SheetClose asChild>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  onChange({ priceRange: [0, 0], sizes: [], brands: [], sort: "relevance" })
                }
              >
                Limpar
              </Button>
            </SheetClose>
          )}
          <SheetClose asChild>
            <Button className="flex-1">Aplicar</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
