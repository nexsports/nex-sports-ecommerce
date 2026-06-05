import Image from "next/image"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* ───────────── Brand + endereço ───────────── */}
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

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Curadoria de produtos esportivos premium — padel, beach tennis,
              futebol, corrida, lifestyle e tecnologia. Entregamos em todo o
              Brasil com suporte ágil e marcas verificadas.
            </p>

            <div className="mt-8">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-muted-foreground/70 mb-2">
                Sede
              </p>
              <p className="text-sm text-foreground">NEX Sports</p>
              <p className="text-sm text-muted-foreground">
                Av. Paulista, 1000
                <br />
                Bela Vista, São Paulo — SP
              </p>
            </div>
          </div>

          {/* ───────────── Atendimento ───────────── */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-muted-foreground/70 mb-6">
              Atendimento
            </p>

            <div className="space-y-5">
              <div>
                <p className="text-xs text-muted-foreground">WhatsApp</p>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  +55 11 99999-9999
                </a>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Vendas</p>
                <a
                  href="tel:+551199999999"
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  (11) 99999-9999
                </a>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Horário</p>
                <p className="text-sm text-foreground">
                  Seg a Sex · 9h às 18h
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">E-mail comercial</p>
                <a
                  href="mailto:contato@nexsportts.com.br"
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  contato@nexsportts.com.br
                </a>
              </div>
            </div>
          </div>

          {/* ───────────── Operação ───────────── */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-muted-foreground/70 mb-6">
              Operação
            </p>

            <ul className="space-y-3 text-sm text-foreground">
              <li>
                São Paulo, SP
                <span className="text-muted-foreground"> · sede e showroom</span>
              </li>
              <li>
                Campinas, SP
                <span className="text-muted-foreground"> · centro de distribuição</span>
              </li>
              <li>
                Curitiba, PR
                <span className="text-muted-foreground"> · hub logístico Sul</span>
              </li>
            </ul>

            <div className="mt-8">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-muted-foreground/70 mb-3">
                Formas de pagamento
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {["Pix", "Visa", "Master", "Elo", "Boleto"].map((p) => (
                  <span
                    key={p}
                    className="text-[11px] text-muted-foreground bg-secondary/60 px-2.5 py-1 rounded-md"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        {/* ───────────── Linha legal ───────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-muted-foreground/70">
          <p>© 2026 NEX Sports. Todos os direitos reservados.</p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="#" className="hover:text-foreground transition-colors">
              Política de privacidade
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Termos de uso
            </Link>
            <span>CNPJ 00.000.000/0001-00</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
