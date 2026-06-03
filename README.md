# NEX SPORTS — E-commerce

E-commerce premium da NEX SPORTS, codado do zero. Substitui o site atual em WordPress/WooCommerce/Elementor por uma stack moderna, rápida, mobile-first, com painel admin completo (estilo Nuvemshop).

## Stack

- **Next.js 15** (App Router, RSC, Turbopack) + **React 19** + **TypeScript**
- **Tailwind v4** + **shadcn/ui** + **framer-motion**
- **PostgreSQL** (Supabase) + **Drizzle ORM**
- **Supabase Auth** (clientes) + Auth admin separada
- **Mercado Pago** (cartão, Pix, boleto)
- **Melhor Envio** (cotação + etiquetas)
- **Resend** (email transacional)
- **Cloudflare Pages** + **R2** (deploy + assets)
- **PostHog** + GA4 + Meta Pixel (analytics)

## Estrutura

```
docs/              PLANO-NEX-ECOMMERCE.md + capturas do site atual
drizzle/           migrations geradas
src/
  app/             rotas Next 15
    (storefront)/  loja
    (admin)/       painel admin /admin
    api/           webhooks + endpoints
  components/
    ui/            shadcn primitives
    storefront/
    admin/
  lib/
    db/            schema, client, seed
    auth/
    payments/
    shipping/
    validators/
    utils.ts
```

## Setup local

```bash
cp .env.example .env
# preencher DATABASE_URL e chaves Supabase

npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Acesso:
- Loja: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`
- Drizzle Studio: `npm run db:studio`

## Scripts

| Script | Função |
|---|---|
| `dev` | Next dev (Turbopack) |
| `build` / `start` | Build + start prod |
| `lint` | ESLint |
| `typecheck` | tsc --noEmit |
| `db:generate` | Gera migration a partir do schema |
| `db:migrate` | Aplica migrations |
| `db:push` | Sync direto (dev only) |
| `db:seed` | Popula dados demo |
| `db:studio` | UI Drizzle |

## Roadmap

Ver [`docs/PLANO-NEX-ECOMMERCE.md`](docs/PLANO-NEX-ECOMMERCE.md) — 14 capítulos cobrindo diagnóstico, arquitetura, DB, design, performance, SEO, admin, deploy.

## Deploy

Cloudflare Pages (front) + Supabase (DB+auth+storage). Staging: `nex-staging.codigozero.app`. Prod: `nexsportts.com.br`.
