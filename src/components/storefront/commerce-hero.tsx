"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Flame, Star, Trophy, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const heroTiles = [
  {
    label: "FUTEBOL",
    href: "/categoria/nex-fut",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    icon: Flame,
  },
  {
    label: "CORRIDA",
    href: "/categoria/nex-run",
    img: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80",
    icon: Zap,
  },
  {
    label: "PADEL",
    href: "/categoria/nex-padel",
    img: "https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?w=600&q=80",
    icon: Trophy,
  },
  {
    label: "TECH",
    href: "/categoria/nex-tech",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    icon: Star,
  },
]

const stats = [
  { value: "8+", label: "Esportes" },
  { value: "500+", label: "Produtos" },
  { value: "4.9★", label: "Avaliações" },
]

export function CommerceHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8 pt-8 pb-12 md:pt-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block text-xs tracking-[0.3em] text-accent uppercase mb-4">
            nova temporada 2026
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            O universo esportivo
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              da nova geração
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Performance, estilo e exclusividade — tudo em um só lugar. As maiores marcas, as melhores coleções.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild className="nex-glow">
              <Link href="/categoria/nex-fut">
                EXPLORAR PRODUTOS
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/busca?q=ofertas">VER OFERTAS</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl md:text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {heroTiles.map((tile, i) => {
            const Icon = tile.icon
            return (
              <Link
                key={tile.label}
                href={tile.href}
                className={cn(
                  "group relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden border border-border",
                  i === 0 && "md:col-span-2 md:row-span-2 md:aspect-auto"
                )}
              >
                <Image
                  src={tile.img}
                  alt={tile.label}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-accent" />
                    <span className="text-xs font-semibold tracking-widest text-accent uppercase">
                      {tile.label}
                    </span>
                  </div>
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors flex items-center gap-1">
                    Explorar <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
