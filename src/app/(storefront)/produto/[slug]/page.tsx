"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { ShoppingBag, Star, Truck, ShieldCheck, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb } from "@/components/storefront/breadcrumb"
import { PdpGallery } from "@/components/storefront/pdp-gallery"
import { PdpVariantSelector } from "@/components/storefront/pdp-variant-selector"
import { MobileBottomBar } from "@/components/storefront/mobile-bottom-bar"
import { useCart } from "@/lib/cart/cart-context"
import { getProductBySlug, getCategoryBySlug } from "@/lib/data/catalog"
import { formatBRL } from "@/lib/utils"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const product = getProductBySlug(slug)
  const cart = useCart()

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "")
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name ?? "")
  const [qty, setQty] = useState(1)

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-2xl font-bold mb-2">Produto não encontrado</h1>
        <p className="text-muted-foreground">Verifique a URL ou volte para a página inicial.</p>
      </div>
    )
  }

  const category = getCategoryBySlug(product.category)
  const price = product.salePriceCents ?? product.priceCents
  const variantId = `${product.id}-${selectedSize}-${selectedColor}`

  const handleAddToCart = () => {
    cart.add({
      variantId,
      productId: product.id,
      title: product.title,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      priceCents: price,
      qty,
    })
    toast.success(`${product.title} adicionado ao carrinho!`)
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
        <Breadcrumb
          items={[
            { label: category?.name ?? product.category, href: `/categoria/${product.category}` },
            { label: product.title },
          ]}
        />

        <div className="grid md:grid-cols-2 gap-8 mt-6">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PdpGallery images={product.images} title={product.title} />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground uppercase tracking-wider">{product.brand}</span>
              {product.badge && (
                <Badge variant={product.badge === "HOT" ? "accent" : product.badge === "NOVO" ? "default" : "destructive"}>
                  {product.badge}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.title}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} avaliações)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              {product.salePriceCents ? (
                <>
                  <span className="text-3xl font-bold text-accent">{formatBRL(product.salePriceCents)}</span>
                  <span className="text-lg text-muted-foreground line-through">{formatBRL(product.priceCents)}</span>
                </>
              ) : (
                <span className="text-3xl font-bold">{formatBRL(product.priceCents)}</span>
              )}
            </div>

            <PdpVariantSelector
              sizes={product.sizes}
              colors={product.colors}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
            />

            {/* Qty */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Quantidade</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Diminuir quantidade"
                >
                  -
                </Button>
                <span className="w-10 text-center font-medium tabular-nums">{qty}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQty(Math.min(10, qty + 1))}
                  aria-label="Aumentar quantidade"
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground ml-2">{product.stock} em estoque</span>
              </div>
            </div>

            {/* Add to cart */}
            <div className="mt-6 hidden md:flex gap-3">
              <Button size="lg" className="flex-1 nex-glow" onClick={handleAddToCart}>
                <ShoppingBag className="h-5 w-5 mr-2" />
                Adicionar ao carrinho — {formatBRL(price * qty)}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Frete grátis acima de R$199" },
                { icon: ShieldCheck, label: "Compra segura" },
                { icon: RotateCcw, label: "Troca em 30 dias" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl bg-secondary/50">
                  <b.icon className="h-4 w-4 text-accent" />
                  <span className="text-[11px] text-muted-foreground leading-tight">{b.label}</span>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Tabs */}
            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Descrição</TabsTrigger>
                <TabsTrigger value="specs">Especificações</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </TabsContent>
              <TabsContent value="specs" className="mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm py-2 border-b border-border">
                    <span className="text-muted-foreground">Marca</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-border">
                    <span className="text-muted-foreground">Categoria</span>
                    <span className="font-medium">{category?.name ?? product.category}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-border">
                    <span className="text-muted-foreground">Cores disponíveis</span>
                    <span className="font-medium">{product.colors.map((c) => c.name).join(", ")}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-border">
                    <span className="text-muted-foreground">Tamanhos</span>
                    <span className="font-medium">{product.sizes.join(", ")}</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-4">
                  {[
                    { name: "Lucas M.", rating: 5, title: "Excelente!", body: "Produto de ótima qualidade, super recomendo. Entrega rápida." },
                    { name: "Ana P.", rating: 4, title: "Muito bom", body: "Cumpre o que promete. Poderia ter mais opções de cor." },
                    { name: "Rafael S.", rating: 5, title: "Top demais", body: "Melhor compra que fiz esse ano. Material premium." },
                  ].map((r, i) => (
                    <div key={i} className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{r.name}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              className={`h-3 w-3 ${j < r.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm font-medium mb-1">{r.title}</p>
                      <p className="text-sm text-muted-foreground">{r.body}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      <MobileBottomBar priceCents={price} onAdd={handleAddToCart} />
    </>
  )
}
