"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  ChevronDown,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/lib/cart/cart-context"
import { formatBRL } from "@/lib/utils"

const FREE_SHIPPING_THRESHOLD = 20000

export function CartDrawer() {
  const { items, remove, updateQty, total, count, isOpen, close } = useCart()
  const [shippingOpen, setShippingOpen] = useState(false)

  const remaining = FREE_SHIPPING_THRESHOLD - total

  return (
    <Sheet open={isOpen} onOpenChange={(v) => { if (!v) close() }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 [&>button]:hidden"
      >
        {/* Accessible title (sr-only) */}
        <SheetHeader className="p-0">
          <SheetTitle className="sr-only">Minhas Compras</SheetTitle>
        </SheetHeader>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#0048D8] to-[#0063FA] shadow-md shrink-0">
          <span className="font-display text-base font-semibold text-white tracking-tight">
            Minhas Compras
          </span>
          <button
            onClick={close}
            aria-label="Fechar carrinho"
            className="rounded-sm p-1 text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Empty state ── */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/20 mb-4" />
            <p className="font-semibold text-foreground">Seu carrinho está vazio</p>
            <p className="text-sm text-muted-foreground mt-1">
              Adicione produtos para começar
            </p>
            <Button asChild className="mt-6">
              <Link href="/busca">Explorar produtos</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* ── Product list ── */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-5 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex gap-3"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-[80px] w-[80px] rounded-lg overflow-hidden bg-secondary/50 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium leading-tight line-clamp-2 pr-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => remove(item.variantId)}
                          aria-label={`Remover ${item.title}`}
                          className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.size && `Tam: ${item.size}`}
                        {item.size && item.color && " · "}
                        {item.color && item.color}
                      </p>

                      {/* Stepper + price */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQty(item.variantId, item.qty - 1)
                            }
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-7 text-center text-sm font-medium tabular-nums">
                            {item.qty}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQty(item.variantId, item.qty + 1)
                            }
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-sm font-bold tabular-nums">
                          {formatBRL(item.priceCents * item.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* ── Footer ── */}
            <div className="border-t border-border shrink-0">
              {/* Free shipping banner */}
              <div
                className={`mx-5 mt-4 rounded-lg px-3.5 py-2.5 flex items-center gap-2.5 text-sm ${
                  remaining <= 0
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <Truck className="h-4 w-4 shrink-0" />
                <span>
                  {remaining <= 0
                    ? "Você ganhou frete grátis 🎉"
                    : `Faltam ${formatBRL(remaining)} pra frete grátis`}
                </span>
              </div>

              <div className="px-5 py-4 space-y-3">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal (sem frete)
                  </span>
                  <span className="font-medium tabular-nums">
                    {formatBRL(total)}
                  </span>
                </div>

                {/* Shipping accordion */}
                <button
                  onClick={() => setShippingOpen((o) => !o)}
                  aria-expanded={shippingOpen}
                  className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Meios de envio</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      shippingOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {shippingOpen && (
                  <p className="text-xs text-muted-foreground pl-0.5 pb-1">
                    Selecione o frete no checkout
                  </p>
                )}

                <Separator />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold tabular-nums">
                    {formatBRL(total)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground -mt-1 text-right">
                  Ou em até 6x de{" "}
                  <span className="font-medium tabular-nums">
                    {formatBRL(Math.ceil(total / 6))}
                  </span>{" "}
                  sem juros
                </p>

                {/* CTA */}
                <Button
                  className="w-full font-semibold text-sm tracking-wide"
                  size="lg"
                  asChild
                >
                  <Link href="/carrinho" onClick={close}>FINALIZAR COMPRA</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
