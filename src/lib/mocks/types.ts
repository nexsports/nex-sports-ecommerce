export interface Category {
  id: string
  slug: string
  name: string
  description: string
  imageUrl: string
  productCount: number
}

export interface Product {
  id: string
  slug: string
  title: string
  brand: string
  category: string
  priceCents: number
  salePriceCents?: number
  images: string[]
  rating: number
  reviewCount: number
  badge?: "HOT" | "NOVO" | "TOP 1" | string
  sizes: string[]
  colors: { name: string; hex: string }[]
  description: string
  stock: number
  gender?: 'masculino' | 'feminino' | 'unissex'
  installments?: number
}

export interface Partner {
  name: string
  logoUrl: string
}

export interface CartItem {
  variantId: string
  productId: string
  title: string
  image: string
  size: string
  color: string
  priceCents: number
  qty: number
}
