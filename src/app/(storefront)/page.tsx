import { CommerceHero } from "@/components/storefront/commerce-hero"
import { BestsellersSection } from "@/components/storefront/bestsellers-section"
import { PartnersMarquee } from "@/components/storefront/partners-marquee"
import { NewsletterCta } from "@/components/storefront/newsletter-cta"

export default function HomePage() {
  return (
    <>
      <CommerceHero />
      <BestsellersSection />
      <PartnersMarquee />
      <NewsletterCta />
    </>
  )
}
