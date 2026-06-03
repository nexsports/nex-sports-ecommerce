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
        id="pix-5off"
        variant="rainbow"
        height="2.5rem"
        className="text-white"
        rainbowColors={[
          "rgba(59, 130, 246, 0.7)",
          "rgba(34, 211, 238, 0.85)",
          "transparent",
          "rgba(59, 130, 246, 0.7)",
          "transparent",
          "rgba(34, 211, 238, 0.85)",
          "transparent",
        ]}
      >
        💸 PAGUE NO PIX E GANHE 5% OFF NA SUA COMPRA
      </Banner>
      {showHeader && <SiteHeader />}
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Toaster position="top-right" richColors />
    </CartProvider>
  )
}
