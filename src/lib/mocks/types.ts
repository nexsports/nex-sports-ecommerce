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
  images: [string, string, string]
  rating: number
  reviewCount: number
  badge?: "HOT" | "NOVO" | "TOP 1" | string
  sizes: string[]
  colors: { name: string; hex: string }[]
  description: string
  stock: number
  gender?: 'masculino' | 'feminino' | 'unissex'
}

export interface Partner {
  name: string
  logoUrl: string
  /** Apply CSS invert when rendered on a light card (use for white-only logos) */
  invertOnLight?: boolean
  /** Skip the white card and render the logo directly (use when the file already has a dark background) */
  noCard?: boolean
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
