"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function NewsletterCta() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      toast.error("Digite um e-mail válido")
      return
    }
    setLoading(true)
    setTimeout(() => {
      toast.success("Inscrito com sucesso! Bem-vindo à NEX SPORTS.")
      setEmail("")
      setLoading(false)
    }, 800)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 md:py-16">
      <div className="relative rounded-3xl border border-border bg-gradient-to-r from-primary/10 via-card to-accent/10 p-8 md:p-12 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
        <div className="relative">
          <Mail className="h-8 w-8 text-accent mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Fique por dentro</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Receba ofertas exclusivas, lançamentos e dicas esportivas direto no seu e-mail.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-background"
              aria-label="E-mail para newsletter"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Inscrevendo..." : "INSCREVER"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
