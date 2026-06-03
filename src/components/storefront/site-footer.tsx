import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { categories } from "@/lib/mocks/catalog"

const supportLinks = [
  { label: "Central de Ajuda", href: "#" },
  { label: "Trocas e Devoluções", href: "#" },
  { label: "Política de Privacidade", href: "#" },
  { label: "Termos de Uso", href: "#" },
]

const aboutLinks = [
  { label: "Sobre a NEX", href: "#" },
  { label: "Trabalhe Conosco", href: "#" },
  { label: "Programa de Afiliados", href: "#" },
  { label: "Blog", href: "#" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Categorias */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Categorias</h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* A NEX */}
          <div>
            <h3 className="text-sm font-semibold mb-4">A NEX</h3>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Contato</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>contato@nexsportts.com.br</li>
              <li>(11) 99999-9999</li>
              <li className="pt-2">
                <span className="text-xs text-muted-foreground/60">
                  Seg-Sex 9h-18h
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-black text-lg">
              NEX
            </span>
            <span className="text-foreground font-bold">SPORTS</span>
          </div>

          <div className="flex items-center gap-3">
            {["Visa", "Mastercard", "PIX", "Boleto"].map((p) => (
              <span
                key={p}
                className="text-xs text-muted-foreground/50 bg-secondary px-2 py-1 rounded-md"
              >
                {p}
              </span>
            ))}
          </div>

          <p className="text-xs text-muted-foreground/50">
            © 2026 NEX SPORTS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
