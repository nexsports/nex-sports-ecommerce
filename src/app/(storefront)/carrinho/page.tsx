"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb } from "@/components/storefront/breadcrumb"
import { useCart } from "@/lib/cart/cart-context"
import { formatBRL } from "@/lib/utils"

export default function CartPage() {
  const { items, remove, updateQty, total, count, clear } = useCart()

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <Breadcrumb items={[{ label: "Carrinho" }]} />

      <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-8">Seu carrinho</h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Carrinho vazio</h2>
          <p className="text-muted-foreground mb-6">Adicione produtos para começar a comprar.</p>
          <Button asChild>
            <Link href="/categoria/nex-fut">
              <ArrowLeft className="h-4 w-4 mr-2" />
              EXPLORAR PRODUTOS
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex gap-4 p-4 rounded-2xl border border-border bg-card"
              >
                <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-xl overflow-hidden bg-secondary/50 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {item.size && `Tam: ${item.size}`}
                    {item.color && ` · ${item.color}`}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQty(item.variantId, item.qty - 1)}
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-8 text-center font-medium tabular-nums">{item.qty}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQty(item.variantId, item.qty + 1)}
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{formatBRL(item.priceCents * item.qty)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => remove(item.variantId)}
                        aria-label={`Remover ${item.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/categoria/nex-fut">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Continuar comprando
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={clear}>
                Limpar carrinho
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-semibold text-lg">Resumo do pedido</h2>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{count} {count === 1 ? "item" : "itens"}</span>
                  <span>{formatBRL(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-muted-foreground text-xs">Calculado no checkout</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">{formatBRL(total)}</span>
              </div>
              <Button className="w-full nex-glow" size="lg">
                FINALIZAR COMPRA
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Frete grátis para compras acima de R$199
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
