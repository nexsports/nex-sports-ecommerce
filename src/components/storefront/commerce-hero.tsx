"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
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

  // Carousel ref
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollCarousel = (dir: "l" | "r") => {
    const el = scrollerRef.current
    if (!el) return
    const step = el.clientWidth
    const maxLeft = el.scrollWidth - el.clientWidth
    if (dir === "r") {
      if (el.scrollLeft + 4 >= maxLeft) el.scrollTo({ left: 0, behavior: "smooth" })
      else el.scrollBy({ left: step, behavior: "smooth" })
    } else {
      if (el.scrollLeft <= 4) el.scrollTo({ left: maxLeft, behavior: "smooth" })
      else el.scrollBy({ left: -step, behavior: "smooth" })
    }
  }

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/busca?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="w-full relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
      <div className="mt-6 bg-card rounded-2xl relative overflow-hidden border border-border/50 shadow-2xl shadow-primary/5">
        {/* ===== TOP CONTACT BAR ===== */}
        <div className="hidden md:flex items-center justify-between gap-4 px-6 py-2 text-[11px] text-foreground/70 border-b border-border/40 bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-5">
            <a href="https://wa.me/5511999999999" className="inline-flex items-center gap-1.5 transition-colors" target="_blank" rel="noreferrer">
              <Image
                src="/branding/whatsapp.png"
                alt=""
                width={512}
                height={512}
                className="h-4 w-4 object-contain [filter:brightness(0)_invert(1)]"
              />
              WhatsApp
            </a>
            <a href="tel:+551199999999" className="inline-flex items-center gap-1.5 transition-colors">
              <Phone className="h-3.5 w-3.5" />
              (11) 99999-9999
            </a>
            <a href="mailto:contato@nexsportts.com.br" className="inline-flex items-center gap-1.5 transition-colors">
              <Mail className="h-3.5 w-3.5" />
              contato@nexsportts.com.br
            </a>
          </div>
          <div className="flex items-center gap-3 text-foreground/80">
            <a href="#" aria-label="Instagram" className="hover:text-[#0061F9] transition-colors">
              <InstagramIcon className="h-3.5 w-3.5" />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-[#0061F9] transition-colors">
              <FacebookIcon className="h-3.5 w-3.5" />
            </a>
            <a href="#" aria-label="TikTok" className="hover:text-[#0061F9] transition-colors">
              <TikTokIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* ===== MAIN BAR ===== */}
        <div className="relative z-30 bg-background/95 backdrop-blur-sm border-b border-border/40">
          {/* MOBILE — row 1: hamburger | logo centralizada | cart */}
          <div className="flex lg:hidden items-center justify-between gap-2 px-4 pt-3 pb-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0" aria-label="Menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0 bg-background/95 backdrop-blur-md border-r border-border/50">
                <SheetHeader className="p-6 text-left border-b border-border/50">
                  <SheetTitle>
                    <Link href="/" aria-label="NEX SPORTS">
                      <Image src="/branding/nex-logo.png" alt="NEX SPORTS" width={1200} height={430} className="h-10 w-auto object-contain" />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-6 space-y-1">
                  {subnavLinks.map((item) => (
                    <Link key={item.name} href={item.href} className="px-3 py-3 rounded-lg text-base font-medium hover:bg-secondary/50 transition-colors">
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <Separator className="mx-6" />
                <div className="p-6 space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Categorias</p>
                  {allCategories.map((cat) => (
                    <Link key={cat.slug} href={`/categoria/${cat.slug}`} className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <Separator className="mx-6" />
                <div className="p-6">
                  <Button asChild className="w-full h-12 rounded-full bg-gradient-to-r from-primary to-accent">
                    <Link href="/login">
                      Entrar
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="shrink-0 inline-flex items-center" aria-label="NEX SPORTS">
              <Image src="/branding/nex-logo.png" alt="NEX SPORTS" width={1200} height={430} priority className="h-10 w-auto object-contain drop-shadow-[0_4px_20px_rgba(59,130,246,0.35)]" />
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => cart?.toggle?.()}
              className="relative text-foreground/80 hover:text-foreground hover:bg-muted/50 shrink-0"
              aria-label={`Carrinho (${cartCount})`}
            >
              <ShoppingBasket className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>

          {/* MOBILE — row 2: search full width */}
          <div className="lg:hidden px-4 pb-3">
            <form onSubmit={submitSearch} role="search" className="w-full">
              <label className="relative flex items-center w-full">
                <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar..."
                  aria-label="Buscar"
                  className="h-10 w-full rounded-full border border-border bg-card/60 pl-11 pr-11 text-sm placeholder:text-muted-foreground focus:bg-card focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="submit"
                  aria-label="Buscar"
                  className="absolute right-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </label>
            </form>
          </div>

          {/* DESKTOP — single row */}
          <div className="hidden lg:flex items-center gap-6 px-6 py-4">
            <Link href="/" className="shrink-0 inline-flex items-center" aria-label="NEX SPORTS">
              <Image src="/branding/nex-logo.png" alt="NEX SPORTS" width={1200} height={430} priority className="h-12 lg:h-14 w-auto object-contain drop-shadow-[0_4px_20px_rgba(59,130,246,0.35)]" />
            </Link>

            <form onSubmit={submitSearch} role="search" className="flex-1 min-w-0 max-w-2xl mx-auto">
              <label className="relative flex items-center w-full">
                <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar produtos, marcas, esportes..."
                  aria-label="Buscar"
                  className="h-12 w-full rounded-full border border-border bg-card/60 pl-11 pr-12 text-sm placeholder:text-muted-foreground focus:bg-card focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="submit"
                  aria-label="Buscar"
                  className="absolute right-1.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </label>
            </form>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => cart?.toggle?.()}
                className="relative text-foreground/80 hover:text-foreground hover:bg-muted/50"
                aria-label={`Carrinho (${cartCount})`}
              >
                <ShoppingBasket className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button
                asChild
                variant="secondary"
                className="bg-background border border-border p-0 pr-1 rounded-full hover:bg-muted/50 transition-all duration-300 group h-10"
              >
                <Link href="/login">
                  <span className="pl-3 py-2 text-sm font-medium">Entrar</span>
                  <div className="rounded-full flex items-center justify-center bg-primary text-primary-foreground w-8 h-8 ml-2 group-hover:scale-110 transition-transform duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ===== SUBNAV — categorias ===== */}
        <nav className="hidden lg:flex items-center justify-center gap-0.5 px-6 py-1 bg-[#0061F9]">
          {subnavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/95 hover:text-white rounded-md transition-colors relative whitespace-nowrap after:absolute after:left-3 after:right-3 after:bottom-0.5 after:h-0.5 after:bg-white after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform"
            >
              {link.name}
            </Link>
          ))}
          <div className="relative group ml-0.5">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/95 hover:text-white rounded-md transition-colors whitespace-nowrap"
            >
              Todas Categorias
              <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[640px] grid grid-cols-2 gap-1 p-3 rounded-2xl bg-background border border-border shadow-2xl shadow-primary/5 transition-opacity z-50">
              {allCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className="group/item flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{cat.name}</span>
                    <span className="text-xs text-muted-foreground">{cat.productCount} produtos</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Sentinel: pill nav from SiteHeader appears only when this passes top of viewport */}
        <div id="hero-end-sentinel" aria-hidden className="h-0 w-full" />

        {/* ===== BANNER ===== */}
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full aspect-square md:aspect-[1672/941] overflow-hidden"
        >
          <Image
            src="/banners/hero-1-mobile.png"
            alt="NEX SPORTS — temporada 2026"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1px"
            className="object-cover md:hidden"
          />
          <Image
            src="/banners/hero-1.png"
            alt="NEX SPORTS — temporada 2026"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="hidden md:block object-contain"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
        </motion.div>
      </div>

      {/* ===== Category carousel ===== */}
      <div className="mt-8 md:mt-12">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Left arrow — outside carousel, desktop only */}
          <button
            onClick={() => scrollCarousel("l")}
            aria-label="Categorias anteriores"
            className="hidden md:flex shrink-0 h-11 w-11 items-center justify-center rounded-full bg-card border border-border shadow-md transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-primary/20 hover:shadow-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Scrollable track */}
          <div
            ref={scrollerRef}
            className="flex-1 min-w-0 flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-3 md:gap-4 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {categoryDisplay.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="group snap-start shrink-0 relative overflow-hidden rounded-2xl w-[210px] md:w-auto md:basis-[calc((100%-3rem)/4)] aspect-[4/5] border border-border/60 bg-card transition-colors duration-300 hover:border-primary/60"
              >
                {/* Background image */}
                <Image
                  src={cat.image}
                  alt={cat.theme}
                  fill
                  sizes="(max-width: 768px) 210px, 280px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15 transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/45" />

                {/* Arrow chip top-right */}
                <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <ArrowUpRight className="h-4 w-4 text-white transition-transform duration-300 group-hover:rotate-12" />
                </div>

                {/* Content bottom */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <p className="text-[10px] md:text-[11px] font-bold text-primary tracking-[0.22em] uppercase drop-shadow">
                    {cat.nexLabel}
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold font-display text-white mt-1 drop-shadow">
                    {cat.theme}
                  </h3>
                  <p className="text-[11px] md:text-xs text-white/75 mt-1.5 line-clamp-2">
                    {cat.subs.join(" · ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Right arrow — outside carousel, desktop only */}
          <button
            onClick={() => scrollCarousel("r")}
            aria-label="Próximas categorias"
            className="hidden md:flex shrink-0 h-11 w-11 items-center justify-center rounded-full bg-card border border-border shadow-md transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-primary/20 hover:shadow-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
