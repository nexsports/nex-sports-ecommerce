"use client"

import { usePathname } from "next/navigation"
import { SiteHeader } from "@/components/storefront/site-header"
import { SiteFooter } from "@/components/storefront/site-footer"
import { CartProvider } from "@/lib/cart/cart-context"
import { Toaster } from "@/components/ui/sonner"
import { Banner } from "@/components/ui/banner"

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showHeader = pathname !== "/"
  return (
    <CartProvider>
      <Banner
        variant="rainbow"
        height="2.25rem"
        className="text-white text-[11px] md:text-xs font-semibold tracking-[0.18em] uppercase shadow-md"
        rainbowColors={["#0048D8", "#0063FA", "#0048D8", "#0063FA"]}
      >
        💸 Pague no Pix e ganhe <span className="text-white font-black mx-1">5% OFF</span> na sua compra
      </Banner>
      {showHeader && <SiteHeader />}
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Toaster position="top-right" richColors />
    </CartProvider>
  )
}
