"use client"

import { MainHeader } from "@/components/storefront/main-header"
import { ScrollNav } from "@/components/storefront/scroll-nav"
import { SiteFooter } from "@/components/storefront/site-footer"
import { CartProvider } from "@/lib/cart/cart-context"
import { CartDrawer } from "@/components/storefront/cart-drawer"
import { Toaster } from "@/components/ui/sonner"
import { Banner } from "@/components/ui/banner"

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {/* Pix banner — in-flow at the top, scrolls away with the page */}
      <Banner
        variant="rainbow"
        height="2.25rem"
        className="relative text-white text-[11px] md:text-xs font-semibold tracking-[0.18em] uppercase shadow-md"
        rainbowColors={["#0048D8", "#0063FA", "#0048D8", "#0063FA"]}
      >
        Pague no Pix e ganhe <span className="text-white font-black mx-1">5% OFF</span> na sua compra
      </Banner>
      {/* MainHeader is in-flow — scrolls away with the page on every page */}
      <MainHeader />
      {/* ScrollNav appears fixed at top after MainHeader scrolls off */}
      <ScrollNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CartDrawer />
      <Toaster position="top-right" richColors />
    </CartProvider>
  )
}
