"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/lib/cart/cart-context"
import { formatBRL } from "@/lib/utils"

export function CartDrawer() {
  const { items, remove, updateQty, total, count } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Carrinho (${count} itens)`}>
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrinho ({count})
          </SheetTitle>
        </SheetHeader>
        <Separator />

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">Seu carrinho está vazio</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Adicione produtos para começar</p>
            <Button asChild className="mt-6">
              <Link href="/categoria/nex-fut">EXPLORAR PRODUTOS</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3">
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-secondary/50 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.size && `Tam: ${item.size}`}
                        {item.color && ` · ${item.color}`}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQty(item.variantId, item.qty - 1)}
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center tabular-nums">{item.qty}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQty(item.variantId, item.qty + 1)}
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{formatBRL(item.priceCents * item.qty)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => remove(item.variantId)}
                            aria-label={`Remover ${item.title}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatBRL(total)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-muted-foreground text-xs">Calcular no checkout</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">{formatBRL(total)}</span>
              </div>
              <Button className="w-full nex-glow" size="lg" asChild>
                <Link href="/carrinho">IR PRO CHECKOUT</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
