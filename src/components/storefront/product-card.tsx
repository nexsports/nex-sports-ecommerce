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
const MIN_INSTALLMENT_CENTS = 1500 // hide installment hint when value below R$ 15

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const cart = useCart()

  const price = product.salePriceCents ?? product.priceCents
  const installmentCents = Math.ceil(price / INSTALLMENTS)
  const showInstallment = installmentCents >= MIN_INSTALLMENT_CENTS

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

  return (
    <Link
      href={`/produto/${product.slug}`}
      className={cn(
        "group relative flex flex-col rounded-2xl bg-card border border-border overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5",
        className,
      )}
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
            className="absolute top-2 left-2 text-[10px] sm:text-xs font-bold"
          >
            {product.badge}
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-3 sm:p-4 flex-1">
        <h3 className="text-sm font-medium leading-tight line-clamp-2 text-foreground min-h-[2.5rem]">
          {product.title}
        </h3>

        <div className="mt-auto pt-2 space-y-2">
          <div>
            {product.salePriceCents ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-bold text-foreground tabular-nums">
                  {formatBRL(product.salePriceCents)}
                </span>
                <span className="text-xs text-muted-foreground line-through tabular-nums">
                  {formatBRL(product.priceCents)}
                </span>
              </div>
            ) : (
              <span className="text-lg sm:text-xl font-bold text-foreground tabular-nums">
                {formatBRL(price)}
              </span>
            )}
            {showInstallment && (
              <p className="text-[10px] text-muted-foreground/70 mt-0.5 tabular-nums">
                ou {INSTALLMENTS}x de {formatBRL(installmentCents)} sem juros
              </p>
            )}
          </div>

          <Button
            type="button"
            onClick={handleAdd}
            className="w-full h-10 rounded-full font-semibold text-sm"
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
