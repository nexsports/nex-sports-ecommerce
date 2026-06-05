"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowUpRight, Menu, ShoppingBasket } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart/cart-context"
import { categoryDisplay } from "@/lib/data/category-display"
import { cn } from "@/lib/utils"

const subnavLinks = [
  { name: "Início", href: "/" },
  { name: "Mais Vendidos", href: "/colecao/destaques" },
  { name: "Produtos", href: "/busca" },
  { name: "Outlet", href: "/colecao/outlet" },
]

export function ScrollNav() {
  const router = useRouter()
  const cart = useCart()
  const cartCount = cart?.count ?? 0
  const [query, setQuery] = useState("")
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const update = () => {
      const sentinel = document.getElementById("main-header-end")
      if (!sentinel) {
        setShown(false)
        return
      }
      setShown(sentinel.getBoundingClientRect().top <= 0)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/busca?q=${encodeURIComponent(q)}`)
  }

  return (
    <div
      aria-hidden={!shown}
      className={cn(
        "fixed left-0 right-0 top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border transition-transform duration-300 ease-out",
        shown ? "translate-y-0" : "-translate-y-full pointer-events-none",
      )}
    >
      {/* MOBILE: hamburger | logo center | cart */}
      <div className="md:hidden grid grid-cols-3 items-center gap-2 px-4 h-14">
        <div className="justify-self-start">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menu" className="h-10 w-10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0">
              <SheetHeader className="p-6 pb-4 border-b border-border/50">
                <SheetTitle>
                  <Link href="/" aria-label="NEX SPORTS">
                    <Image src="/branding/nex-logo.avif" alt="NEX SPORTS" width={1200} height={430} className="h-10 w-auto object-contain" />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-6 space-y-1">
                {subnavLinks.map((item) => (
                  <SheetClose asChild key={item.name}><Link href={item.href} className="px-3 py-3 rounded-lg text-base font-medium hover:bg-secondary/50 transition-colors">{item.name}</Link></SheetClose>
                ))}
              </nav>
              <Separator className="mx-6" />
              <div className="p-6 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Categorias</p>
                {categoryDisplay.map((cat) => (
                  <SheetClose asChild key={cat.slug}><Link href={`/categoria/${cat.slug}`} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors group">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">{cat.theme}</span>
                      <span className="text-[10px] text-primary font-semibold tracking-wider">{cat.nexLabel}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link></SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" aria-label="NEX SPORTS" className="justify-self-center inline-flex items-center">
          <Image src="/branding/nex-logo.avif" alt="NEX SPORTS" width={1200} height={430} className="h-9 w-auto object-contain" />
        </Link>

        <div className="justify-self-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => cart?.toggle?.()}
            className="relative h-10 w-10"
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
      </div>

      {/* DESKTOP: hamburger | logo | search | cart | Entrar */}
      <div className="hidden md:flex items-center justify-center gap-3 px-6 lg:px-10 h-16">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Abrir menu" className="shrink-0 h-11 w-11">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0">
            <SheetHeader className="p-6 pb-4 border-b border-border/50">
              <SheetTitle>
                <Link href="/" aria-label="NEX SPORTS">
                  <Image src="/branding/nex-logo.avif" alt="NEX SPORTS" width={1200} height={430} className="h-10 w-auto object-contain" />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-6 space-y-1">
              {subnavLinks.map((item) => (
                <SheetClose asChild key={item.name}><Link href={item.href} className="px-3 py-3 rounded-lg text-base font-medium hover:bg-secondary/50 transition-colors">{item.name}</Link></SheetClose>
              ))}
            </nav>
            <Separator className="mx-6" />
            <div className="p-6 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Categorias</p>
              {categoryDisplay.map((cat) => (
                <SheetClose asChild key={cat.slug}><Link href={`/categoria/${cat.slug}`} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors group">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{cat.theme}</span>
                    <span className="text-[10px] text-primary font-semibold tracking-wider">{cat.nexLabel}</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link></SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="shrink-0 inline-flex items-center" aria-label="NEX SPORTS">
          <Image src="/branding/nex-logo.avif" alt="NEX SPORTS" width={1200} height={430} className="h-9 w-auto object-contain" />
        </Link>

        <form onSubmit={submitSearch} role="search" className="min-w-0 flex-1 max-w-md">
          <label className="relative flex items-center w-full">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              aria-label="Buscar"
              className="h-10 w-full min-w-0 rounded-full border border-border bg-card/60 pl-5 pr-4 text-sm placeholder:text-muted-foreground focus:bg-card focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </label>
        </form>

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

        <Button
          asChild
          variant="secondary"
          className="bg-background border border-border p-0 pr-1 rounded-full hover:bg-muted/50 transition-all duration-300 group h-9 shrink-0"
        >
          <Link href="/login">
            <span className="pl-3 py-1.5 text-sm font-medium">Entrar</span>
            <div className="rounded-full flex items-center justify-center bg-primary text-primary-foreground w-7 h-7 ml-2 group-hover:scale-110 transition-transform duration-300">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </Button>
      </div>
    </div>
  )
}
