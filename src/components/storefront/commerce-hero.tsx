"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  ArrowUpRight,
  ChevronDown,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShoppingBasket,
  User,
} from "lucide-react"

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
import { cn } from "@/lib/utils"

const subnavLinks = [
  { name: "Início", href: "/" },
  { name: "Mais Vendidos", href: "/colecao/destaques" },
  { name: "Produtos", href: "/busca" },
  { name: "Outlet", href: "/colecao/outlet" },
]

const featuredSlugs = ["nex-fut", "nex-run", "nex-padel", "nex-tech"]

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

  const featured = featuredSlugs
    .map((s) => allCategories.find((c) => c.slug === s))
    .filter(Boolean)
    .map((c) => ({
      title: c!.name.replace(/^NEX /, ""),
      image: c!.imageUrl,
      href: `/categoria/${c!.slug}`,
    }))

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
            <a href="https://wa.me/5511999999999" className="inline-flex items-center gap-1.5 hover:text-accent transition-colors" target="_blank" rel="noreferrer">
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
            <a href="tel:+551199999999" className="inline-flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone className="h-3.5 w-3.5" />
              (11) 99999-9999
            </a>
            <a href="mailto:contato@nexsportts.com.br" className="inline-flex items-center gap-1.5 hover:text-accent transition-colors">
              <Mail className="h-3.5 w-3.5" />
              contato@nexsportts.com.br
            </a>
          </div>
          <div className="flex items-center gap-3 text-foreground/80">
            <a href="#" aria-label="Instagram" className="hover:text-accent transition-colors">
              <InstagramIcon className="h-3.5 w-3.5" />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-accent transition-colors">
              <FacebookIcon className="h-3.5 w-3.5" />
            </a>
            <a href="#" aria-label="TikTok" className="hover:text-accent transition-colors">
              <TikTokIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* ===== MAIN BAR — logo + search + actions ===== */}
        <div className="relative z-30 flex items-center gap-4 md:gap-6 px-4 md:px-6 py-3 md:py-4 bg-background/95 backdrop-blur-sm border-b border-border/40">
          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden shrink-0" aria-label="Menu">
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

          {/* Logo */}
          <Link href="/" className="shrink-0 inline-flex items-center" aria-label="NEX SPORTS">
            <Image
              src="/branding/nex-logo.png"
              alt="NEX SPORTS"
              width={1200}
              height={430}
              priority
              className="h-10 md:h-12 lg:h-14 w-auto object-contain drop-shadow-[0_4px_20px_rgba(59,130,246,0.35)]"
            />
          </Link>

          {/* Big centered search */}
          <form onSubmit={submitSearch} role="search" className="flex-1 min-w-0 max-w-2xl mx-auto">
            <label className="relative flex items-center w-full">
              <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar produtos, marcas, esportes..."
                aria-label="Buscar"
                className="h-11 md:h-12 w-full rounded-full border border-border bg-card/60 pl-11 pr-12 text-sm placeholder:text-muted-foreground focus:bg-card focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="absolute right-1.5 inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </label>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Link href="/login" className="hidden md:inline-flex items-center gap-1.5 text-xs text-foreground/70 hover:text-foreground transition-colors px-2">
              <User className="h-4 w-4" />
              <span className="hidden lg:inline">
                <span className="font-medium">Entrar</span>
                <span className="text-foreground/50"> · </span>
                <span className="text-foreground/70">Cadastrar</span>
              </span>
              <span className="lg:hidden font-medium">Entrar</span>
            </Link>
            <Button variant="ghost" size="icon" asChild className="relative text-foreground/80 hover:text-foreground hover:bg-muted/50" aria-label={`Carrinho (${cartCount})`}>
              <Link href="/carrinho">
                <ShoppingBasket className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* ===== SUBNAV — categorias ===== */}
        <nav className="hidden lg:flex items-center gap-1 px-6 py-2.5 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/15 border-b border-border/40">
          {subnavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-semibold uppercase tracking-wider text-foreground/90 hover:text-white rounded-md transition-colors relative whitespace-nowrap after:absolute after:left-4 after:right-4 after:bottom-1 after:h-0.5 after:bg-accent after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform"
            >
              {link.name}
            </Link>
          ))}
          <div className="relative group ml-1">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-foreground/90 hover:text-white rounded-md transition-colors whitespace-nowrap"
            >
              Todas Categorias
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full left-0 mt-1 w-[640px] grid grid-cols-2 gap-1 p-3 rounded-2xl bg-background border border-border shadow-2xl shadow-primary/5 transition-opacity z-50">
              {allCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className="group/item flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{cat.name}</span>
                    <span className="text-xs text-muted-foreground">{cat.productCount} produtos</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-foreground/60 uppercase tracking-widest">Siga</span>
            <a href="#" aria-label="Instagram" className="text-foreground/70 hover:text-accent transition-colors">
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Facebook" className="text-foreground/70 hover:text-accent transition-colors">
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a href="#" aria-label="TikTok" className="text-foreground/70 hover:text-accent transition-colors">
              <TikTokIcon className="h-4 w-4" />
            </a>
          </div>
        </nav>

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

      {/* ===== Featured category tiles ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mt-8 md:mt-12">
        {featured.map((category, index) => (
          <motion.div
            key={category.title}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
            className="group relative bg-muted/50 backdrop-blur-sm rounded-3xl p-4 sm:p-6 min-h-[250px] sm:min-h-[300px] w-full overflow-hidden border border-border/50 transition-all duration-500 hover:border-primary/50"
          >
            <Link href={category.href} className="absolute inset-0 z-20">
              <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-black relative z-10 text-foreground my-2 sm:my-4 group-hover:text-primary transition-colors duration-300 uppercase tracking-tight">
                {category.title}
              </h2>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full max-w-[min(60vw,260px)] sm:max-w-[min(40vw,220px)] md:max-w-[min(28vw,200px)] lg:max-w-[min(24vw,180px)] h-auto object-contain opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-background/95 backdrop-blur-sm rounded-tl-xl flex items-center justify-center z-10 border-l border-t border-border/50">
                <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
