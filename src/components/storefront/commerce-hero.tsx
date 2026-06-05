"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  Menu,
  Phone,
  Search,
  ShoppingBasket,
} from "lucide-react"

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.52 3.48A12 12 0 0 0 2.05 17.18L1 23l5.94-1.04A12 12 0 1 0 20.52 3.48zm-8.5 18.32A9.94 9.94 0 0 1 6.9 20.4l-.36-.21-3.52.62.63-3.43-.23-.36A9.95 9.95 0 1 1 22.02 12a9.93 9.93 0 0 1-10 9.8zm5.46-7.42c-.3-.15-1.76-.87-2.04-.97s-.47-.15-.67.15-.77.97-.94 1.17-.35.22-.65.07c-.3-.15-1.27-.47-2.42-1.5a9.06 9.06 0 0 1-1.68-2.08c-.18-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01a1.1 1.1 0 0 0-.8.37 3.34 3.34 0 0 0-1.04 2.48c0 1.46 1.07 2.87 1.22 3.07s2.1 3.21 5.1 4.5c.71.31 1.27.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.07-.13-.27-.2-.57-.35z" />
    </svg>
  )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { useCart } from "@/lib/cart/cart-context"
import { categories as allCategories } from "@/lib/data/catalog"
import { categoryDisplay } from "@/lib/data/category-display"
import { cn } from "@/lib/utils"

const subnavLinks = [
  { name: "Início", href: "/" },
  { name: "Mais Vendidos", href: "/colecao/destaques" },
  { name: "Produtos", href: "/busca" },
  { name: "Outlet", href: "/colecao/outlet" },
]


// TikTok glyph (não tem no lucide-react)
function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.06a8.16 8.16 0 0 0 4.77 1.52V6.13a4.85 4.85 0 0 1-1.84-.44z" />
    </svg>
  )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
    </svg>
  )
}

export function CommerceHero() {
  const cart = useCart()
  const router = useRouter()
  const cartCount = cart?.count ?? 0
  const [query, setQuery] = useState("")

  // Embla infinite carousel (real loop, touch swipe, GPU-accelerated)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    duration: 28,
    dragFree: false,
    containScroll: false,
  })
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  // Pagination dots state
  const [snaps, setSnaps] = useState<number[]>([])
  const [selected, setSelected] = useState(0)
  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    const onReInit = () => setSnaps(emblaApi.scrollSnapList())
    onReInit()
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onReInit)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onReInit)
    }
  }, [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/busca?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="w-full relative">
      {/* Sentinel kept for any legacy detection elsewhere */}
      <div id="hero-end-sentinel" aria-hidden className="h-0 w-full" />
            {/* ===== BANNER (contido em max-w-7xl) ===== */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full aspect-square md:aspect-[1672/941] overflow-hidden rounded-2xl mt-6 border border-border/40"
        >
          <Image
            src="/banners/hero-1-mobile.avif"
            alt="NEX SPORTS — temporada 2026"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1px"
            className="object-cover md:hidden"
          />
          <Image
            src="/banners/hero-1.avif"
            alt="NEX SPORTS — temporada 2026"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="hidden md:block object-contain"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
        </motion.div>
      </div>

      {/* ===== Category carousel — Embla, real infinite loop ===== */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 mt-8 md:mt-12">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Left arrow — desktop only */}
          <button
            onClick={scrollPrev}
            aria-label="Categorias anteriores"
            className="hidden md:flex shrink-0 h-11 w-11 items-center justify-center rounded-full bg-card border border-border shadow-md transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-primary/20 hover:shadow-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Embla viewport */}
          <div ref={emblaRef} className="flex-1 min-w-0 overflow-hidden">
            <div className="flex -ml-3 md:-ml-4">
              {categoryDisplay.map((cat) => (
                <div
                  key={cat.slug}
                  className="shrink-0 grow-0 basis-1/2 sm:basis-1/3 md:basis-1/4 pl-3 md:pl-4"
                >
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="group relative block overflow-hidden rounded-2xl aspect-[4/5] border border-border/60 bg-card transition-colors duration-300 hover:border-primary/60"
                  >
                    <Image
                      src={cat.image}
                      alt={cat.theme}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15 transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/45" />
                    <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                      <ArrowUpRight className="h-4 w-4 text-white transition-transform duration-300 group-hover:rotate-12" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-5">
                      <p className="text-[10px] md:text-[11px] font-bold text-primary tracking-[0.22em] uppercase drop-shadow">
                        {cat.nexLabel}
                      </p>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold font-display text-white mt-1 drop-shadow">
                        {cat.theme}
                      </h3>
                      <p className="text-[11px] md:text-xs text-white/75 mt-1.5 line-clamp-2">
                        {cat.subs.join(" · ")}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right arrow — desktop only */}
          <button
            onClick={scrollNext}
            aria-label="Próximas categorias"
            className="hidden md:flex shrink-0 h-11 w-11 items-center justify-center rounded-full bg-card border border-border shadow-md transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-primary/20 hover:shadow-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Pagination dots */}
        {snaps.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2">
            {snaps.map((_, i) => {
              const active = i === selected
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollTo(i)}
                  aria-label={`Ir para slide ${i + 1}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "transition-all rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                    active ? "h-2 w-6 bg-primary" : "h-2 w-2 bg-white/40 hover:bg-white/70"
                  )}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
