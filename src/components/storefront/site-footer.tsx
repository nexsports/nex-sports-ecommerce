import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { categoryDisplay } from "@/lib/data/category-display"

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.52 3.48A12 12 0 0 0 2.05 17.18L1 23l5.94-1.04A12 12 0 1 0 20.52 3.48zm-8.5 18.32A9.94 9.94 0 0 1 6.9 20.4l-.36-.21-3.52.62.63-3.43-.23-.36A9.95 9.95 0 1 1 22.02 12a9.93 9.93 0 0 1-10 9.8zm5.46-7.42c-.3-.15-1.76-.87-2.04-.97s-.47-.15-.67.15-.77.97-.94 1.17-.35.22-.65.07c-.3-.15-1.27-.47-2.42-1.5a9.06 9.06 0 0 1-1.68-2.08c-.18-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01a1.1 1.1 0 0 0-.8.37 3.34 3.34 0 0 0-1.04 2.48c0 1.46 1.07 2.87 1.22 3.07s2.1 3.21 5.1 4.5c.71.31 1.27.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.07-.13-.27-.2-.57-.35z" />
    </svg>
  )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.06a8.16 8.16 0 0 0 4.77 1.52V6.13a4.85 4.85 0 0 1-1.84-.44z" />
    </svg>
  )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
    </svg>
  )
}

const socialLinks = [
  { Icon: InstagramIcon, label: "Instagram", href: "#" },
  { Icon: FacebookIcon, label: "Facebook", href: "#" },
  { Icon: TikTokIcon, label: "TikTok", href: "#" },
]

const sobreLinks = [
  { text: "Quem somos", href: "#" },
  { text: "Carreiras", href: "#" },
  { text: "Imprensa", href: "#" },
  { text: "Blog", href: "/blog" },
]

const ajudaLinks = [
  { text: "Central de ajuda", href: "#" },
  { text: "Trocas e devoluções", href: "#" },
  { text: "Política de privacidade", href: "#" },
  { text: "Termos de uso", href: "#" },
]

const contatoInfo = [
  { Icon: Mail, text: "contato@nexsportts.com.br" },
  { Icon: Phone, text: "(11) 99999-9999" },
  { Icon: MapPin, text: "Av. Paulista, 1000 — São Paulo, SP", isAddress: true },
]

export function SiteFooter() {
  return (
    <footer className="bg-secondary/20 mt-16 w-full rounded-t-2xl border-t border-border">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* ── Brand + social ── */}
          <div>
            <Link href="/" aria-label="NEX SPORTS" className="inline-block">
              <Image
                src="/branding/nex-logo.png"
                alt="NEX SPORTS"
                width={1200}
                height={430}
                className="h-9 w-auto object-contain"
              />
            </Link>

            <p className="text-foreground/60 mt-6 max-w-md text-sm leading-relaxed">
              Curadoria de produtos esportivos premium — padel, beach tennis,
              futebol, corrida, lifestyle e tecnologia. Entregamos em todo o
              Brasil com suporte ágil e marcas verificadas.
            </p>

            <ul className="mt-8 flex gap-5 md:gap-6">
              {socialLinks.map(({ Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="text-primary hover:text-primary/80 transition-colors"
                    aria-label={label}
                  >
                    <Icon className="size-5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Link columns ── */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-2">
            {/* Categorias */}
            <div>
              <p className="text-base font-semibold">Categorias</p>
              <ul className="mt-6 space-y-3 text-sm">
                {categoryDisplay.slice(0, 6).map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/categoria/${cat.slug}`}
                      className="text-foreground/70 hover:text-foreground transition-colors"
                    >
                      {cat.theme}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sobre */}
            <div>
              <p className="text-base font-semibold">A NEX</p>
              <ul className="mt-6 space-y-3 text-sm">
                {sobreLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      href={href}
                      className="text-foreground/70 hover:text-foreground transition-colors"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ajuda */}
            <div>
              <p className="text-base font-semibold">Ajuda</p>
              <ul className="mt-6 space-y-3 text-sm">
                {ajudaLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      href={href}
                      className="text-foreground/70 hover:text-foreground transition-colors"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contato */}
            <div>
              <p className="text-base font-semibold">Contato</p>
              <ul className="mt-6 space-y-4 text-sm">
                {contatoInfo.map(({ Icon, text, isAddress }) => (
                  <li key={text} className="flex items-start gap-2">
                    <Icon className="text-primary size-4 shrink-0 mt-0.5" />
                    {isAddress ? (
                      <address className="text-foreground/70 not-italic leading-snug">
                        {text}
                      </address>
                    ) : (
                      <span className="text-foreground/70">{text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Legal bottom ── */}
        <div className="mt-12 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-foreground/60 sm:flex-row">
            <p>© 2026 NEX Sports. Todos os direitos reservados.</p>
            <p>CNPJ 00.000.000/0001-00</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
