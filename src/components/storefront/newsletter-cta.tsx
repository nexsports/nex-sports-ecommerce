"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"

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
      toast.success("Inscrito com sucesso! Bem-vindo à NEX Sports.")
      setEmail("")
      setLoading(false)
    }, 800)
  }

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      {/* Ambient primary glow background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-primary opacity-10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-primary opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-2xl md:text-3xl font-bold font-display tracking-tight">
                Receba ofertas em primeira mão
              </h3>
              <p className="text-foreground/70 mb-6 max-w-md">
                Lançamentos, descontos e novidades NEX Sports direto no seu
                e-mail. Cancele a qualquer momento.
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  aria-label="E-mail para newsletter"
                  className="flex-1 rounded-lg border border-foreground/20 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/30 focus:outline-none transition"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition disabled:opacity-60"
                >
                  {loading ? "Inscrevendo..." : "INSCREVER"}
                </button>
              </form>
            </div>

            {/* Visual side */}
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rotate-6 rounded-2xl bg-primary/20" />
                <div className="relative w-80 h-60 rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src="/branding/newsletter-banner.png"
                    alt="NEX Sports"
                    fill
                    sizes="320px"
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
