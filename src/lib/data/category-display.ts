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
    image: '/categories/nex-fut.avif',
  },
  {
    slug: 'nex-fit',
    theme: 'Academia',
    nexLabel: 'NEX FIT',
    subs: ['Dry Fit', 'Shorts', 'Acessórios'],
    image: '/categories/nex-fit.avif',
  },
  {
    slug: 'nex-beach',
    theme: 'Praia',
    nexLabel: 'NEX BEACH',
    subs: ['Beach Tennis', 'Futevôlei'],
    image: '/categories/nex-beach.avif',
  },
  {
    slug: 'nex-padel',
    theme: 'Padel',
    nexLabel: 'NEX PADEL',
    subs: ['Raquetes', 'Bolas', 'Bags'],
    image: '/categories/nex-padel.avif',
  },
  {
    slug: 'nex-run',
    theme: 'Corrida',
    nexLabel: 'NEX RUN',
    subs: ['Tênis', 'GPS', 'Hidratação'],
    image: '/categories/nex-run.avif',
  },
  {
    slug: 'nex-court',
    theme: 'Quadra',
    nexLabel: 'NEX COURT',
    subs: ['Basquete', 'Vôlei', 'Futsal'],
    image: '/categories/nex-court.avif',
  },
  {
    slug: 'nex-style',
    theme: 'Lifestyle',
    nexLabel: 'NEX STYLE',
    subs: ['Streetwear', 'Caps', 'Mochilas'],
    image: '/categories/nex-style.avif',
  },
  {
    slug: 'nex-tech',
    theme: 'Tecnologia',
    nexLabel: 'NEX TECH',
    subs: ['Smartwatches', 'Fones', 'Gadgets'],
    image: '/categories/nex-tech.avif',
  },
]

export function getCategoryDisplayBySlug(slug: string): CategoryDisplay | undefined {
  return categoryDisplay.find((c) => c.slug === slug)
}
