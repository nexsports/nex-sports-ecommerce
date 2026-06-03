"use client"

import { usePathname } from "next/navigation"
import { SiteHeader } from "@/components/storefront/site-header"
import { SiteFooter } from "@/components/storefront/site-footer"
import { CartProvider } from "@/lib/cart/cart-context"
import { Toaster } from "@/components/ui/sonner"

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Home renders its own embedded header inside CommerceHero
  const showHeader = pathname !== "/"
  return (
    <CartProvider>
      {showHeader && <SiteHeader />}
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Toaster position="top-right" richColors />
    </CartProvider>
  )
}
