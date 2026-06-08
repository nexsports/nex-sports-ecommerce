"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBasket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, formatBRL } from "@/lib/utils"
import { useCart } from "@/lib/cart/cart-context"
import type { Product } from "@/lib/mocks/types"
import { showCartAddedToast } from "./cart-added-toast"

const INSTALLMENTS = 6

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const cart = useCart()

  const price = product.salePriceCents ?? product.priceCents
  const installmentCents = Math.ceil(price / INSTALLMENTS)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const defaultSize = product.sizes[0] ?? "Único"
    const defaultColor = product.colors[0]?.name ?? "Padrão"
    const variantId = `${product.id}-${defaultSize}-${defaultColor}`
    cart.add({
      variantId,
      productId: product.id,
      title: product.title,
      image: product.images[0],
      size: defaultSize,
      color: defaultColor,
      priceCents: price,
      qty: 1,
    }, { silent: true })
    const items = [...(cart.items ?? [])]
    const existing = items.find((i) => i.variantId === variantId)
    const nextQty = existing ? existing.qty + 1 : 1
    const cartCount = (cart.count ?? 0) + 1
    const cartTotal = (cart.total ?? 0) + price
    showCartAddedToast({
      image: product.images[0],
      title: product.title,
      priceCents: price,
      qty: nextQty,
      cartCount,
      cartTotal,
    })
  }

  const discountPct = product.salePriceCents
    ? Math.round(((product.priceCents - product.salePriceCents) / product.priceCents) * 100)
    : 0

  return (
    <Link
      href={`/produto/${product.slug}`}
      className={cn(
        "group relative flex flex-col rounded-2xl bg-card border border-border/60 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary/40 to-secondary/10">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          />
        )}

        {/* Top-left badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.badge && (
            <Badge
              variant={product.badge === "HOT" ? "accent" : product.badge === "NOVO" ? "default" : "destructive"}
              className="text-[10px] font-bold shadow-md"
            >
              {product.badge}
            </Badge>
          )}
          {discountPct > 0 && (
            <span className="inline-flex items-center rounded-md bg-destructive text-destructive-foreground px-2 py-0.5 text-[10px] font-bold shadow-md">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Subtle bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-col gap-2 p-3 sm:p-4 flex-1">
        {product.brand && (
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80 font-semibold">
            {product.brand}
          </span>
        )}

        <h3 className="text-sm font-medium leading-snug line-clamp-2 text-foreground min-h-[2.5rem]">
          {product.title}
        </h3>

        <div className="mt-auto pt-1.5 space-y-2.5">
          <div>
            {product.salePriceCents ? (
              <>
                <span className="block text-[11px] text-muted-foreground line-through tabular-nums leading-none mb-0.5">
                  {formatBRL(product.priceCents)}
                </span>
                <span className="block text-xl sm:text-[22px] font-bold text-foreground tabular-nums leading-tight">
                  {formatBRL(product.salePriceCents)}
                </span>
              </>
            ) : (
              <span className="block text-xl sm:text-[22px] font-bold text-foreground tabular-nums leading-tight">
                {formatBRL(price)}
              </span>
            )}
            <p className="text-[10px] text-muted-foreground/70 mt-1 tabular-nums">
              ou {INSTALLMENTS}x de {formatBRL(installmentCents)} sem juros
            </p>
          </div>

          <Button
            type="button"
            onClick={handleAdd}
            className="w-full h-10 rounded-full font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
            aria-label={`Adicionar ${product.title} ao carrinho`}
          >
            <ShoppingBasket className="h-4 w-4 mr-2" />
            Comprar
          </Button>
        </div>
      </div>
    </Link>
  )
}
