"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function PdpGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex gap-3">
      {/* Thumbnails - desktop left, mobile hidden */}
      <div className="hidden md:flex flex-col gap-2 shrink-0">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-all",
              active === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
            )}
            aria-label={`Ver imagem ${i + 1}`}
          >
            <Image src={img} alt={`${title} ${i + 1}`} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-secondary/50">
        <Image
          src={images[active]}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />

        {/* Mobile dots */}
        <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                active === i ? "bg-primary w-4" : "bg-white/50"
              )}
              aria-label={`Ver imagem ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
