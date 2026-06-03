import { CommerceHero } from "@/components/storefront/commerce-hero"
import { FeaturedSection } from "@/components/storefront/featured-section"
import { BestsellersSection } from "@/components/storefront/bestsellers-section"
import { WeeklyFindsSection } from "@/components/storefront/weekly-finds-section"
import { WeeklyOfferSection } from "@/components/storefront/weekly-offer-section"
import { PartnersMarquee } from "@/components/storefront/partners-marquee"
import { NewsletterCta } from "@/components/storefront/newsletter-cta"

export default function HomePage() {
  return (
    <>
      <CommerceHero />
      <FeaturedSection />
      <WeeklyOfferSection />
      <BestsellersSection />
      <WeeklyFindsSection />
      <PartnersMarquee />
      <NewsletterCta />
    </>
  )
}
