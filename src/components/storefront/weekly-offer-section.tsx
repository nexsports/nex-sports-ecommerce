"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatBRL } from "@/lib/utils"
import { getWeeklyFinds } from "@/lib/data/catalog"

function getNextSunday2359(): Date {
  const now = new Date()
  const day = now.getDay()
  const daysUntilSunday = day === 0 ? 0 : 7 - day
  const target = new Date(now)
  target.setDate(now.getDate() + daysUntilSunday)
  target.setHours(23, 59, 59, 0)
  if (target <= now) target.setDate(target.getDate() + 7)
  return target
}

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  return timeLeft
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-secondary rounded-xl w-14 h-14 flex items-center justify-center border border-border">
        <span className="text-2xl font-bold tabular-nums text-foreground">{String(value).padStart(2, "0")}</span>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  )
}

export function WeeklyOfferSection() {
  const target = useCallback(() => getNextSunday2359(), [])
  const [deadline, setDeadline] = useState<Date | null>(null)
  const timeLeft = useCountdown(deadline ?? new Date())

  useEffect(() => {
    setDeadline(target())
  }, [target])

  const product = getWeeklyFinds()[0]
  if (!product) return null

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden border border-border bg-gradient-to-r from-primary/10 via-card to-accent/10"
      >
        <div className="grid md:grid-cols-2 gap-6 p-6 md:p-10">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/50">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-accent mb-2">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-semibold tracking-widest uppercase">Oferta da semana</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h2>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>

            <div className="flex items-baseline gap-3 mb-6">
              {product.salePriceCents ? (
                <>
                  <span className="text-3xl font-bold text-accent">{formatBRL(product.salePriceCents)}</span>
                  <span className="text-lg text-muted-foreground line-through">{formatBRL(product.priceCents)}</span>
                </>
              ) : (
                <span className="text-3xl font-bold">{formatBRL(product.priceCents)}</span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Termina em:</span>
            </div>

            <div className="flex gap-3 mb-8">
              <CountdownUnit value={timeLeft.days} label="dias" />
              <CountdownUnit value={timeLeft.hours} label="horas" />
              <CountdownUnit value={timeLeft.minutes} label="min" />
              <CountdownUnit value={timeLeft.seconds} label="seg" />
            </div>

            <Button size="lg" asChild className="nex-glow w-fit">
              <Link href={`/produto/${product.slug}`}>APROVEITAR OFERTA</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
