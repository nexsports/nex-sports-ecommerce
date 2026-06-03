"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { categories } from "@/lib/mocks/catalog"

export function SportsHighlightSection() {
  const main = categories[0]
  const small = categories.slice(1, 5)

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Esportes em destaque</h2>

        <div className="grid md:grid-cols-3 gap-3 md:gap-4">
          <Link
            href={`/categoria/${main.slug}`}
            className="group relative md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto rounded-2xl overflow-hidden border border-border"
          >
            <Image
              src={main.imageUrl}
              alt={main.name}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-1">{main.name}</h3>
              <p className="text-sm text-white/70 mb-3">{main.productCount} produtos disponíveis</p>
              <span className="text-sm text-accent flex items-center gap-1">
                Explorar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-3 md:gap-4 md:col-span-1">
            {small.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-border"
              >
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-3">
                  <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                  <span className="text-xs text-white/60">{cat.productCount} produtos</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
