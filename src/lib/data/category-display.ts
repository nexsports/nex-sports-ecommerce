export interface CategoryDisplay {
  slug: string
  theme: string
  nexLabel: string
  subs: string[]
  image: string
}

export const categoryDisplay: CategoryDisplay[] = [
  {
    slug: 'nex-fut',
    theme: 'Futebol',
    nexLabel: 'NEX FUT',
    subs: ['Chuteiras', 'Camisas', 'Meias'],
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80',
  },
  {
    slug: 'nex-fit',
    theme: 'Academia',
    nexLabel: 'NEX FIT',
    subs: ['Dry Fit', 'Shorts', 'Acessórios'],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  },
  {
    slug: 'nex-beach',
    theme: 'Praia',
    nexLabel: 'NEX BEACH',
    subs: ['Beach Tennis', 'Futevôlei'],
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80',
  },
  {
    slug: 'nex-padel',
    theme: 'Padel',
    nexLabel: 'NEX PADEL',
    subs: ['Raquetes', 'Bolas', 'Bags'],
    image: 'https://images.unsplash.com/photo-1622279457486-28f993f78bce?w=800&q=80',
  },
  {
    slug: 'nex-run',
    theme: 'Corrida',
    nexLabel: 'NEX RUN',
    subs: ['Tênis', 'GPS', 'Hidratação'],
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
  },
  {
    slug: 'nex-court',
    theme: 'Quadra',
    nexLabel: 'NEX COURT',
    subs: ['Basquete', 'Vôlei', 'Futsal'],
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
  },
  {
    slug: 'nex-style',
    theme: 'Lifestyle',
    nexLabel: 'NEX STYLE',
    subs: ['Streetwear', 'Caps', 'Mochilas'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  },
  {
    slug: 'nex-tech',
    theme: 'Tecnologia',
    nexLabel: 'NEX TECH',
    subs: ['Smartwatches', 'Fones', 'Gadgets'],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  },
]

export function getCategoryDisplayBySlug(slug: string): CategoryDisplay | undefined {
  return categoryDisplay.find((c) => c.slug === slug)
}
