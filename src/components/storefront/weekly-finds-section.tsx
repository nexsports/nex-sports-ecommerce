"use client"

import { motion } from "framer-motion"
import { Percent } from "lucide-react"
import { ProductGrid } from "./product-grid"
import { getWeeklyFinds } from "@/lib/mocks/catalog"

export function WeeklyFindsSection() {
  const products = getWeeklyFinds()

  if (products.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-8">
          <Percent className="h-5 w-5 text-accent" />
          <h2 className="text-2xl md:text-3xl font-bold">Ofertas da semana</h2>
        </div>
        <ProductGrid products={products} />
      </motion.div>
    </section>
  )
}
