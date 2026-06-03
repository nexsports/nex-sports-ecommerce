"use client"

import { SiteHeader } from "@/components/storefront/site-header"
import { SiteFooter } from "@/components/storefront/site-footer"
import { CartProvider } from "@/lib/cart/cart-context"
import { Toaster } from "@/components/ui/sonner"

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Toaster position="top-right" richColors />
    </CartProvider>
  )
}
