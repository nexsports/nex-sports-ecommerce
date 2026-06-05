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

      {/* Mobile: horizontal snap scroll | Desktop: main image */}
      <div className="md:hidden w-full overflow-x-auto snap-x snap-mandatory flex gap-2 rounded-2xl scrollbar-none">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative aspect-square w-full flex-shrink-0 snap-center rounded-2xl overflow-hidden bg-secondary/50"
          >
            <Image
              src={img}
              alt={`${title} ${i + 1}`}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="hidden md:block relative aspect-square w-full rounded-2xl overflow-hidden bg-secondary/50">
        <Image
          src={images[active]}
          alt={title}
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
      </div>
    </div>
  )
}
