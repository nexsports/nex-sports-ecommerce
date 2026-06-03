"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowUpRight, Menu, Search, ShoppingBasket } from "lucide-react"
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
import { useScroll } from "@/lib/hooks/use-scroll"
import { categories } from "@/lib/data/catalog"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Início", href: "/" },
  { name: "Mais Vendidos", href: "/colecao/destaques" },
  { name: "Produtos", href: "/busca" },
  { name: "Outlet", href: "/colecao/outlet" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === "/"
  const scrolled = useScroll(80)
  const cart = useCart()
  const count = cart?.count ?? 0
  const [query, setQuery] = useState("")

  const hidden = isHome && !scrolled

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/busca?q=${encodeURIComponent(q)}`)
  }

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-50 mx-auto w-full max-w-6xl px-3 transition-all duration-300 ease-out",
        hidden ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100",
        scrolled ? "top-3 md:top-4" : "top-0 md:top-0",
      )}
    >
      <nav
        className={cn(
          "flex items-center gap-2 sm:gap-3 px-3 md:px-4 h-14 md:h-16 transition-all duration-300 ease-out",
          scrolled
            ? "rounded-2xl border border-border bg-background/85 backdrop-blur-xl shadow-2xl shadow-primary/5"
            : "rounded-none bg-background/85 backdrop-blur-xl border-b border-border",
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0" aria-label="NEX SPORTS">
          <Image
            src="/branding/nex-logo.png"
            alt="NEX SPORTS"
            width={1200}
            height={430}
            priority
            className="h-9 md:h-10 w-auto object-contain drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]"
          />
        </Link>

        {/* Hamburger — opens nav + categories sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Abrir menu" className="shrink-0">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0">
            <SheetHeader className="p-6 pb-4 border-b border-border/50">
              <SheetTitle>
                <Image
                  src="/branding/nex-logo.png"
                  alt="NEX SPORTS"
                  width={1200}
                  height={430}
                  className="h-10 w-auto object-contain"
                />
              </SheetTitle>
            </SheetHeader>
            <div className="p-6 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-3 rounded-lg text-base font-medium transition-colors",
                    pathname === item.href
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <Separator className="mx-6" />
            <div className="p-6 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Categorias</p>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <Separator className="mx-6" />
            <div className="p-6">
              <Button asChild className="w-full h-12 rounded-full">
                <Link href="/login">
                  Entrar
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Search bar — large, centered, always expanded */}
        <form
          onSubmit={submitSearch}
          role="search"
          className="flex-1 min-w-0 max-w-2xl mx-auto"
        >
          <label className="relative flex items-center w-full">
            <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos, marcas, esportes..."
              aria-label="Buscar"
              className="h-10 w-full rounded-full border border-border bg-card/60 pl-11 pr-4 text-sm placeholder:text-muted-foreground focus:bg-card focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </label>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" asChild className="relative text-foreground/80 hover:text-foreground hover:bg-muted/50" aria-label={`Carrinho (${count})`}>
            <Link href="/carrinho">
              <ShoppingBasket className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="hidden sm:inline-flex bg-background border border-border p-0 pr-1 rounded-full hover:bg-muted/50 transition-all duration-300 group h-10 ml-1"
          >
            <Link href="/login">
              <span className="pl-3 py-2 text-sm font-medium">Entrar</span>
              <div className="rounded-full flex items-center justify-center bg-primary text-primary-foreground w-8 h-8 ml-2 group-hover:scale-110 transition-transform duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
