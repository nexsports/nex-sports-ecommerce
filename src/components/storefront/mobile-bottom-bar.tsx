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
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-background/90 backdrop-blur-xl border-t border-border p-3">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Preço</p>
          <p className="text-lg font-bold">{formatBRL(priceCents)}</p>
        </div>
        <Button
          className="flex-1 nex-glow"
          size="lg"
          onClick={onAdd}
          disabled={disabled}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
    </div>
  )
}
