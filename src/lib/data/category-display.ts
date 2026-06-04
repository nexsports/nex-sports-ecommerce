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
    image: '/categories/nex-fut.png',
  },
  {
    slug: 'nex-fit',
    theme: 'Academia',
    nexLabel: 'NEX FIT',
    subs: ['Dry Fit', 'Shorts', 'Acessórios'],
    image: '/categories/nex-fit.png',
  },
  {
    slug: 'nex-beach',
    theme: 'Praia',
    nexLabel: 'NEX BEACH',
    subs: ['Beach Tennis', 'Futevôlei'],
    image: '/categories/nex-beach.png',
  },
  {
    slug: 'nex-padel',
    theme: 'Padel',
    nexLabel: 'NEX PADEL',
    subs: ['Raquetes', 'Bolas', 'Bags'],
    image: '/categories/nex-padel.png',
  },
  {
    slug: 'nex-run',
    theme: 'Corrida',
    nexLabel: 'NEX RUN',
    subs: ['Tênis', 'GPS', 'Hidratação'],
    image: '/categories/nex-run.png',
  },
  {
    slug: 'nex-court',
    theme: 'Quadra',
    nexLabel: 'NEX COURT',
    subs: ['Basquete', 'Vôlei', 'Futsal'],
    image: '/categories/nex-court.png',
  },
  {
    slug: 'nex-style',
    theme: 'Lifestyle',
    nexLabel: 'NEX STYLE',
    subs: ['Streetwear', 'Caps', 'Mochilas'],
    image: '/categories/nex-style.png',
  },
  {
    slug: 'nex-tech',
    theme: 'Tecnologia',
    nexLabel: 'NEX TECH',
    subs: ['Smartwatches', 'Fones', 'Gadgets'],
    image: '/categories/nex-tech.png',
  },
]

export function getCategoryDisplayBySlug(slug: string): CategoryDisplay | undefined {
  return categoryDisplay.find((c) => c.slug === slug)
}
