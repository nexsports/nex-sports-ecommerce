"use client"

import { partners } from "@/lib/data/catalog"

const brandLogos: Record<string, string> = {
  Nike: "NIKE",
  Adidas: "ADIDAS",
  Puma: "PUMA",
  Asics: "ASICS",
  "New Balance": "NEW BALANCE",
  "Under Armour": "UNDER ARMOUR",
  Mizuno: "MIZUNO",
  Wilson: "WILSON",
}

export function PartnersMarquee() {
  const doubled = [...partners, ...partners]

  return (
    <section className="py-10 md:py-14 border-y border-border overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 mb-6">
        <p className="text-center text-sm text-muted-foreground uppercase tracking-widest">
          Marcas parceiras
        </p>
      </div>

      <div className="relative flex overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {doubled.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="flex items-center justify-center h-10 text-lg md:text-xl font-bold tracking-widest text-muted-foreground/40 hover:text-foreground transition-colors"
            >
              {brandLogos[p.name] ?? p.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
