"use client"

import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, X } from "lucide-react"
import { toast } from "sonner"
import { formatBRL } from "@/lib/utils"

interface ToastProps {
  id: string | number
  image: string
  title: string
  priceCents: number
  qty: number
  cartCount: number
  cartTotal: number
}

function CartAddedCard({ id, image, title, priceCents, qty, cartCount, cartTotal }: ToastProps) {
  return (
    <div className="relative w-[340px] rounded-xl border border-border bg-card shadow-2xl shadow-black/40 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0048D8] to-[#0063FA] text-white">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span className="text-sm font-semibold flex-1">Adicionado ao carrinho!</span>
        <button
          onClick={() => toast.dismiss(id)}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 flex gap-3">
        <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-secondary/50">
          <Image src={image} alt={title} fill sizes="64px" className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight">{title}</p>
          <p className="text-xs text-muted-foreground mt-1 tabular-nums">
            {qty} x {formatBRL(priceCents)}
          </p>
        </div>
      </div>
      <div className="px-4 py-3 border-t border-border flex items-end justify-between bg-secondary/20">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total ({cartCount} {cartCount === 1 ? "produto" : "produtos"})</p>
          <p className="text-base font-bold text-foreground tabular-nums">{formatBRL(cartTotal)}</p>
        </div>
        <Link
          href="/carrinho"
          onClick={() => toast.dismiss(id)}
          className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          Ver carrinho
        </Link>
      </div>
    </div>
  )
}

export function showCartAddedToast(opts: Omit<ToastProps, "id">) {
  toast.custom((id) => <CartAddedCard id={id} {...opts} />, { duration: 5000 })
}
