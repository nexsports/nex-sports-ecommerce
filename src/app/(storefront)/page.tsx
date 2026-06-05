import { CommerceHero } from "@/components/storefront/commerce-hero"
import { BestsellersSection } from "@/components/storefront/bestsellers-section"
import { PartnersMarquee } from "@/components/storefront/partners-marquee"
import { NewsletterCta } from "@/components/storefront/newsletter-cta"
import { getBestSellers, getPartners } from "@/lib/db/queries/storefront"

export default async function HomePage() {
  const [bestSellers, partners] = await Promise.all([
    getBestSellers(4),
    getPartners(),
  ])

  return (
    <>
      <CommerceHero />
      <BestsellersSection products={bestSellers} />
      <PartnersMarquee partners={partners} />
      <NewsletterCta />
    </>
  )
}
