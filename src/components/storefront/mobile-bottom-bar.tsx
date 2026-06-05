"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatBRL } from "@/lib/utils"

interface MobileBottomBarProps {
  priceCents: number
  onAdd: () => void
  disabled?: boolean
}

export function MobileBottomBar({ priceCents, onAdd, disabled }: MobileBottomBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-background/95 backdrop-blur-xl border-t border-border px-4 pb-[env(safe-area-inset-bottom,12px)] pt-3">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Preço</p>
          <p className="text-lg font-bold">{formatBRL(priceCents)}</p>
        </div>
        <Button
          className="flex-1 nex-glow h-12 min-h-[48px]"
          size="lg"
          onClick={onAdd}
          disabled={disabled}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </div>
    </div>
  )
}
