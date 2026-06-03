"use client"

import { cn } from "@/lib/utils"

interface VariantSelectorProps {
  sizes: string[]
  colors: { name: string; hex: string }[]
  selectedSize: string
  selectedColor: string
  onSizeChange: (size: string) => void
  onColorChange: (color: string) => void
  outOfStockSizes?: string[]
}

export function PdpVariantSelector({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
  outOfStockSizes = [],
}: VariantSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">
            Cor: <span className="text-muted-foreground font-normal">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => onColorChange(c.name)}
                className={cn(
                  "relative h-9 w-9 rounded-full border-2 transition-all",
                  selectedColor === c.name
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-muted-foreground"
                )}
                aria-label={`Cor: ${c.name}`}
              >
                <span
                  className="absolute inset-1 rounded-full"
                  style={{ backgroundColor: c.hex }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">
            Tamanho: <span className="text-muted-foreground font-normal">{selectedSize}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const oos = outOfStockSizes.includes(s)
              return (
                <button
                  key={s}
                  onClick={() => !oos && onSizeChange(s)}
                  disabled={oos}
                  className={cn(
                    "min-w-[2.5rem] h-10 px-3 rounded-xl text-sm font-medium transition-all border",
                    selectedSize === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : oos
                      ? "bg-secondary/30 text-muted-foreground/40 border-transparent line-through cursor-not-allowed"
                      : "bg-secondary text-foreground border-transparent hover:border-muted-foreground"
                  )}
                  aria-label={`Tamanho ${s}${oos ? " (esgotado)" : ""}`}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
