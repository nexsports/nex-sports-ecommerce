"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, ShoppingBag, User, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/lib/cart/cart-context"
import { categories } from "@/lib/mocks/catalog"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Futebol", href: "/categoria/nex-fut" },
  { label: "Fitness", href: "/categoria/nex-fit" },
  { label: "Corrida", href: "/categoria/nex-run" },
  { label: "Padel", href: "/categoria/nex-padel" },
  { label: "Style", href: "/categoria/nex-style" },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const { count } = useCart()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMegaOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="p-6 pb-4">
                <SheetTitle className="text-left">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-black text-xl">
                    NEX SPORTS
                  </span>
                </SheetTitle>
              </SheetHeader>
              <Separator />
              <ScrollArea className="h-[calc(100vh-10rem)]">
                <div className="p-6 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between py-3 px-3 rounded-xl text-sm font-medium transition-colors",
                        pathname === link.href
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      {link.label}
                      <ChevronRight className="h-4 w-4" />
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
                      className="flex items-center justify-between py-2 px-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                    >
                      {cat.name}
                      <span className="text-xs text-muted-foreground/50">{cat.productCount}</span>
                    </Link>
                  ))}
                </div>
                <Separator className="mx-6" />
                <div className="p-6">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/login">
                      <User className="h-4 w-4 mr-2" />
                      Entrar
                    </Link>
                  </Button>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-black text-xl tracking-tight">
              NEX
            </span>
            <span className="text-foreground font-bold text-lg hidden sm:inline">SPORTS</span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop mega menu dropdown */}
          {megaOpen && (
            <div
              className="hidden md:block absolute top-full left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-border shadow-lg"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-4 gap-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categoria/${cat.slug}`}
                      className="flex flex-col gap-1 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                    >
                      <span className="text-sm font-medium">{cat.name}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">{cat.description}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild aria-label="Buscar">
              <Link href="/busca">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Conta">
              <User className="h-5 w-5" />
            </Button>
            <Link href="/carrinho">
              <Button variant="ghost" size="icon" className="relative" aria-label={`Carrinho (${count} itens)`}>
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <Badge
                    variant="accent"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full"
                  >
                    {count}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
