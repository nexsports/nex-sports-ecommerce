"use client"

import Image from "next/image"
import Link from "next/link"
import { Plus, Star } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, formatBRL } from "@/lib/utils"
import { useCart } from "@/lib/cart/cart-context"
import type { Product } from "@/lib/mocks/types"

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i < Math.round(rating) ? "fill-accent text-accent" : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">({count})</span>
    </div>
  )
}

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const cart = useCart()

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const defaultSize = product.sizes[0]
    const defaultColor = product.colors[0]?.name ?? ""
    const variantId = `${product.id}-${defaultSize}-${defaultColor}`
    const price = product.salePriceCents ?? product.priceCents
    cart.add({
      variantId,
      productId: product.id,
      title: product.title,
      image: product.images[0],
      size: defaultSize,
      color: defaultColor,
      priceCents: price,
      qty: 1,
    })
    toast.success(`${product.title} adicionado ao carrinho!`)
  }

  const price = product.salePriceCents ?? product.priceCents

  return (
    <Link
      href={`/produto/${product.slug}`}
      className={cn("group relative flex flex-col rounded-2xl bg-card border border-border overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5", className)}
    >
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          />
        )}
        {product.badge && (
          <Badge
            variant={product.badge === "HOT" ? "accent" : product.badge === "NOVO" ? "default" : "destructive"}
            className="absolute top-2.5 left-2.5 text-xs font-bold"
          >
            {product.badge}
          </Badge>
        )}
        <Button
          size="icon"
          className="absolute bottom-2.5 right-2.5 h-9 w-9 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
          onClick={handleAdd}
          aria-label={`Adicionar ${product.title} ao carrinho`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-1.5 p-3.5 flex-1">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand}</span>
        <h3 className="text-sm font-medium leading-tight line-clamp-2 text-foreground">{product.title}</h3>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          {product.salePriceCents ? (
            <>
              <span className="text-lg font-bold text-accent">{formatBRL(product.salePriceCents)}</span>
              <span className="text-sm text-muted-foreground line-through">{formatBRL(product.priceCents)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-foreground">{formatBRL(product.priceCents)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
