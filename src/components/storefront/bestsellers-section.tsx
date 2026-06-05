"use client"

import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"
import { ProductGrid } from "./product-grid"
import { getBestSellers } from "@/lib/data/catalog"

export function BestsellersSection() {
  const products = getBestSellers()

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 md:py-16">
      <motion.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-6 md:mb-8">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold">Mais vendidos</h2>
        </div>
        <ProductGrid products={products} />
      </motion.div>
    </section>
  )
}
