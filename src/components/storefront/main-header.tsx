"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import {
  ArrowUpRight,
  ChevronDown,
  Mail,
  Menu,
  Phone,
  Search,
  ShoppingBasket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
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

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Image
      src="/branding/whatsapp.png"
      alt=""
      width={512}
      height={512}
      {...(props as object)}
      className="h-4 w-4 object-contain [filter:brightness(0)_invert(1)]"
    />
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

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
    </svg>
  )
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.06a8.16 8.16 0 0 0 4.77 1.52V6.13a4.85 4.85 0 0 1-1.84-.44z" />
    </svg>
  )
}

export function MainHeader() {
  const router = useRouter()
  const cart = useCart()
  const cartCount = cart?.count ?? 0
  const [query, setQuery] = useState("")
  const [visible, setVisible] = useState(true)
  const lastYRef = useRef(0)

  // Auto-hide on scroll down, show on scroll up, always show at top
  useEffect(() => {
    const TOP_THRESHOLD = 8
    const DELTA = 6
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastYRef.current
      if (y <= TOP_THRESHOLD) {
        setVisible(true)
      } else if (Math.abs(delta) < DELTA) {
        // ignore micro scroll
      } else if (delta < 0) {
        setVisible(true)
      } else {
        setVisible(false)
      }
      lastYRef.current = y
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/busca?q=${encodeURIComponent(q)}`)
  }

  // Shared horizontal padding so topbar / mainbar / subnav align on the same x edges
  const ROW_PX = "px-4 md:px-6 lg:px-10"

  return (
    <header
      aria-hidden={!visible}
      className={cn(
        "fixed left-0 right-0 z-40 w-full top-0 transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      {/* ===== TOP CONTACT BAR (desktop only) ===== */}
      <div className={cn("hidden md:flex w-full items-center justify-between gap-4 py-2 text-[11px] text-foreground/70 border-b border-border/40 bg-background/95 backdrop-blur-sm", ROW_PX)}>
        <div className="flex items-center gap-5">
          <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <WhatsAppIcon />
            WhatsApp
          </a>
          <a href="tel:+551199999999" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Phone className="h-3.5 w-3.5" />
            (11) 99999-9999
          </a>
          <a href="mailto:contato@nexsportts.com.br" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
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
      <div className="bg-background/95 backdrop-blur-sm border-b border-border/40">
        {/* DESKTOP: logo | search (flex-1) | cart | Entrar */}
        <div className={cn("hidden md:flex items-center gap-3 lg:gap-4 h-16 lg:h-20", ROW_PX)}>
          {/* Hamburger (desktop, for full sheet menu) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menu" className="shrink-0">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0">
              <SheetHeader className="p-6 pb-4 border-b border-border/50">
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
                {categoryDisplay.map((cat) => (
                  <Link key={cat.slug} href={`/categoria/${cat.slug}`} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors group">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">{cat.theme}</span>
                      <span className="text-[10px] text-primary font-semibold tracking-wider">{cat.nexLabel}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="shrink-0 inline-flex items-center" aria-label="NEX SPORTS">
            <Image
              src="/branding/nex-logo.png"
              alt="NEX SPORTS"
              width={1200}
              height={430}
              priority
              className="h-10 lg:h-12 w-auto object-contain drop-shadow-[0_4px_18px_rgba(59,130,246,0.3)]"
            />
          </Link>

          {/* Search (takes remaining space) */}
          <form onSubmit={submitSearch} role="search" className="flex-1 min-w-0">
            <label className="relative flex items-center w-full">
              <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar produtos, marcas, esportes..."
                aria-label="Buscar"
                className="h-11 w-full rounded-full border border-border bg-card/60 pl-11 pr-12 text-sm placeholder:text-muted-foreground focus:bg-card focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="absolute right-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </label>
          </form>

          {/* Right cluster: cart + Entrar (tight) */}
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

        {/* MOBILE: row1 hamburger | logo | cart   row2 search */}
        <div className="md:hidden">
          <div className={cn("flex items-center justify-between gap-2 pt-3 pb-2", ROW_PX)}>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu" className="shrink-0">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0">
                <SheetHeader className="p-6 pb-4 border-b border-border/50">
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
                  {categoryDisplay.map((cat) => (
                    <Link key={cat.slug} href={`/categoria/${cat.slug}`} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors group">
                      <span className="text-sm font-semibold text-foreground">{cat.theme}</span>
                      <span className="text-[10px] text-primary font-semibold tracking-wider">{cat.nexLabel}</span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" aria-label="NEX SPORTS" className="shrink-0 inline-flex items-center">
              <Image src="/branding/nex-logo.png" alt="NEX SPORTS" width={1200} height={430} priority className="h-9 w-auto object-contain" />
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => cart?.toggle?.()}
              className="relative shrink-0"
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
          <div className={cn("pb-3", ROW_PX)}>
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
        </div>
      </div>

      {/* ===== SUBNAV — categorias (desktop only) ===== */}
      <nav className={cn("hidden lg:flex items-center justify-center gap-0.5 py-1.5 bg-[#0061F9]", ROW_PX)}>
        {subnavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/95 hover:text-white rounded-md transition-colors whitespace-nowrap relative after:absolute after:left-3 after:right-3 after:bottom-0.5 after:h-0.5 after:bg-white after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform"
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
    </header>
  )
}
