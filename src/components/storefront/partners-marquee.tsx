"use client"

import Image from "next/image"
import { partners } from "@/lib/data/catalog"

export function PartnersMarquee() {
  // Repeat enough times so the marquee fills the viewport even with few partners
  const reel = [...partners, ...partners, ...partners, ...partners, ...partners, ...partners]

  return (
    <section className="py-10 md:py-14 border-y border-border overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 mb-8">
        <p className="text-center text-sm text-muted-foreground uppercase tracking-widest">
          Marcas parceiras
        </p>
      </div>

      <div className="relative flex overflow-hidden">
        <div className="flex items-center gap-16 md:gap-24 animate-marquee whitespace-nowrap">
          {reel.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="relative flex items-center justify-center h-14 md:h-16 w-32 md:w-44 shrink-0"
            >
              {p.logoUrl ? (
                <Image
                  src={p.logoUrl}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 128px, 176px"
                  className="object-contain"
                />
              ) : (
                <span className="text-lg md:text-xl font-bold tracking-widest text-muted-foreground">
                  {p.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
