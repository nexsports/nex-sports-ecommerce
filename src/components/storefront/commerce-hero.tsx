"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Menu, Search, ShoppingBasket } from "lucide-react"
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

const navigation = [
  { name: "Início", href: "/" },
  { name: "Loja", href: "/busca" },
  { name: "Coleções", href: "/categoria/nex-fut" },
  { name: "Blog", href: "#" },
]

const featuredSlugs = ["nex-fut", "nex-run", "nex-padel", "nex-tech"]

export function CommerceHero() {
  const cart = useCart()
  const cartCount = cart?.count ?? 0

  const featured = featuredSlugs
    .map((s) => allCategories.find((c) => c.slug === s))
    .filter(Boolean)
    .map((c) => ({
      title: c!.name.replace(/^NEX /, ""),
      image: c!.imageUrl,
      href: `/categoria/${c!.slug}`,
    }))

  return (
    <div className="w-full relative container px-2 mx-auto max-w-7xl">
      <div className="mt-6 bg-card rounded-2xl relative overflow-hidden border border-border/50 shadow-2xl shadow-primary/5">
        <header className="flex items-center">
          <div className="w-full md:w-2/3 lg:w-1/2 bg-background/95 backdrop-blur-sm p-4 rounded-br-2xl flex items-center gap-4">
            <Link href="/" className="shrink-0 inline-flex items-center" aria-label="NEX SPORTS">
              <Image
                src="/branding/nex-logo.png"
                alt="NEX SPORTS"
                width={140}
                height={40}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>

            <nav className="hidden lg:flex items-center justify-between w-full ml-2">
              <ul className="flex items-center gap-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-md transition-colors relative after:absolute after:left-3 after:right-3 after:bottom-1 after:h-px after:bg-primary after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-1 ml-auto">
                <Button variant="ghost" size="icon" asChild className="text-foreground/80 hover:text-foreground hover:bg-muted/50" aria-label="Buscar">
                  <Link href="/busca">
                    <Search className="w-5 h-5" />
                  </Link>
                </Button>
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
            </nav>

            <Sheet>
              <SheetTrigger asChild className="lg:hidden ml-auto">
                <Button variant="ghost" size="icon" className="hover:text-primary transition-colors" aria-label="Menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[400px] p-0 bg-background/95 backdrop-blur-md border-r border-border/50"
              >
                <SheetHeader className="p-6 text-left border-b border-border/50">
                  <SheetTitle className="flex items-center justify-between">
                    <Link href="/" aria-label="NEX SPORTS">
                      <Image
                        src="/branding/nex-logo.png"
                        alt="NEX SPORTS"
                        width={140}
                        height={40}
                        className="h-10 w-auto object-contain"
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-6 space-y-1">
                  {navigation.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      asChild
                      className="justify-start px-2 h-12 text-base font-medium hover:bg-accent/50 hover:text-primary transition-colors"
                    >
                      <Link href={item.href}>{item.name}</Link>
                    </Button>
                  ))}
                </nav>
                <Separator className="mx-6" />
                <div className="p-6 flex flex-col gap-4">
                  <Button variant="outline" asChild className="justify-start gap-2 h-12 hover:bg-accent/50 transition-colors">
                    <Link href="/busca">
                      <Search className="w-4 h-4" />
                      Buscar
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start gap-2 h-12 hover:bg-accent/50 transition-colors relative">
                    <Link href="/carrinho">
                      <ShoppingBasket className="w-4 h-4" />
                      Carrinho
                      {cartCount > 0 && (
                        <span className="absolute right-3 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </Button>
                </div>
                <Separator className="mx-6" />
                <div className="p-6">
                  <Button asChild className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/80 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Link href="/login">
                      Entrar
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex w-1/2 justify-end items-center pr-4 gap-4 ml-auto">
            <Button
              variant="secondary"
              asChild
              className="cursor-pointer bg-background p-0 pr-1 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group h-12"
            >
              <Link href="/login">
                <span className="pl-4 py-2 text-sm font-medium">Entrar</span>
                <div className="rounded-full flex items-center justify-center bg-primary text-primary-foreground w-10 h-10 ml-2 group-hover:scale-110 transition-transform duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </Link>
            </Button>
          </div>
        </header>

        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full aspect-[21/9] md:aspect-[16/6] lg:aspect-[21/8] overflow-hidden"
        >
          <Image
            src="/banners/hero-1.png"
            alt="NEX SPORTS — temporada 2026"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
        </motion.div>
      </div>

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
