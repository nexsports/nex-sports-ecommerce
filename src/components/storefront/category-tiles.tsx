"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { categories } from "@/lib/data/catalog"

export function CategoryTiles() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Explore por esporte</h2>
          <p className="text-muted-foreground text-sm mt-1">Encontre tudo para sua modalidade</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link
              href={`/categoria/${cat.slug}`}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-border block"
            >
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-3.5">
                <h3 className="text-base md:text-lg font-bold text-white">{cat.name}</h3>
                <p className="text-xs text-white/60 mt-0.5">{cat.productCount} produtos</p>
                <span className="text-xs text-accent mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver tudo <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
