import { ProductCard } from "./product-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Product } from "@/lib/mocks/types"

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-2xl border border-border bg-card overflow-hidden">
          <Skeleton className="aspect-square rounded-none" />
          <div className="p-3.5 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
