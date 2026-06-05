"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

// TODO: replace with real WhatsApp group invite when ready
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/PLACEHOLDER-NEX-SPORTS"

function WhatsAppIcon() {
  return (
    <Image
      src="/branding/whatsapp.avif"
      alt=""
      width={512}
      height={512}
      className="h-5 w-5 object-contain [filter:brightness(0)_invert(1)]"
    />
  )
}

export function NewsletterCta() {
  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      {/* Ambient primary glow background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-primary opacity-10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-primary opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 sm:p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/15 text-[#25D366] px-3 py-1 text-[10px] font-bold tracking-wider uppercase mb-4">
                Grupo VIP · WhatsApp
              </span>
              <h3 className="mb-3 text-2xl md:text-3xl font-bold font-display tracking-tight">
                Promoções, drops e ofertas em primeira mão
              </h3>
              <p className="text-foreground/70 mb-6 max-w-md">
                Entra no nosso grupo do WhatsApp e recebe os melhores preços
                NEX Sports antes de todo mundo. Sem spam, sem zoeira — só
                avisos quando algo bom rola.
              </p>

              <a
                href={WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#1da851] hover:shadow-[#25D366]/40 transition-all"
              >
                <WhatsAppIcon />
                Entrar no grupo
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            {/* Visual side — visible on all sizes; appears above text on mobile */}
            <div className="order-first md:order-none flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rotate-6 rounded-2xl bg-primary/20" />
                <div className="relative w-60 h-44 sm:w-72 sm:h-52 md:w-80 md:h-60 rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src="/branding/newsletter-banner.avif"
                    alt="NEX Sports"
                    fill
                    sizes="(max-width: 640px) 240px, (max-width: 768px) 288px, 320px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
