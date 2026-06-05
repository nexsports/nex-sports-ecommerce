"use client"

import { MainHeader } from "@/components/storefront/main-header"
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
        className="relative z-50 text-white text-[11px] md:text-xs font-semibold tracking-[0.18em] uppercase shadow-md"
        rainbowColors={["#0048D8", "#0063FA", "#0048D8", "#0063FA"]}
      >
        Pague no Pix e ganhe <span className="text-white font-black mx-1">5% OFF</span> na sua compra
      </Banner>
      <MainHeader />
      {/* Header heights: ~150px desktop (topbar 32 + main 80 + subnav 38) / ~110px mobile (main 2 rows) */}
      <main className="flex-1 pt-[110px] md:pt-[150px]">{children}</main>
      <SiteFooter />
      <CartDrawer />
      <Toaster position="top-right" richColors />
    </CartProvider>
  )
}
