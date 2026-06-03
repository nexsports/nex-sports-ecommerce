# PLANO MESTRE — NEX SPORTS E-COMMERCE V2

> Rebuild from scratch. Codado, sem WordPress. Mobile-first, rápido, otimizado, com painel admin estilo Nuvemshop.

---

## 1. DIAGNÓSTICO DO SITE ATUAL (nexsportts.com.br)

**Stack atual:** WordPress + Elementor + WooCommerce + tema `nex-theme`.

**Problemas críticos detectados:**
- 12 erros de console no carregamento inicial.
- Seções renderizando vazias no scroll: `MAIS VENDIDOS`, `ACHADOS DA SEMANA`, `ESPORTES EM DESTAQUE`, `PARCEIROS NEX` (imagens não carregam, grids quebrados).
- HTML inicial pesado: ~977 KB, 28 scripts, 24 CSS, 55 imagens — typical Elementor bloat.
- Imagens de produto = placeholders Unsplash (não tem catálogo real).
- Não tem painel admin acessível (cliente final não consegue cadastrar produto sozinho).
- Carrinho/checkout WooCommerce default, não otimizado para conversão.
- Mobile com layout colapsando (texto "produto destaque" cortado em "produ destaqu").
- SEO básico ausente (title duplicado: "Nex Sports: Premium Sports Gear OnlineNEX SPORTS").

**Sobrevive da versão atual:**
- Estrutura de categorias (8 verticais: NEX FUT/FIT/BEACH/PADEL/RUN/COURT/STYLE/TECH).
- Identidade visual: azul escuro + cyan/azul claro com glow.
- Posicionamento: "Universo esportivo da nova geração".
- Parceiros: Nike, Adidas, Puma, Asics, New Balance, Under Armour, Mizuno, Wilson.

---

## 2. STACK NOVO (recomendado)

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | RSC, ISR, edge runtime, SEO nativo |
| UI | **React 19 + Tailwind v4 + shadcn/ui** | Compatível com `CommerceHero` referência |
| Animação | **framer-motion** (só onde precisa) | Já no exemplo do hero |
| DB | **PostgreSQL (Supabase)** | RLS, auth integrada, storage de imagens |
| ORM | **Drizzle ORM** | Type-safe, leve, migrations versionadas |
| Auth | **Supabase Auth** (cliente) + **NextAuth/Lucia** (admin) | Separar customer/admin |
| Pagamento | **Mercado Pago + Pix + Cartão** (Brasil) | Stripe opcional |
| Frete | **Melhor Envio API** | Cotação correios/transportadora |
| Imagens | **Next/Image** + **Supabase Storage** (ou Cloudflare R2) | Otimização automática WebP/AVIF |
| Email | **Resend** + **React Email** | Confirmação pedido, status, recuperação carrinho |
| Analytics | **PostHog** ou **Plausible** + GA4 + Meta Pixel | Funil de checkout |
| Deploy | **Cloudflare Pages** (front) + **Supabase** (DB) | Velocidade, custo baixo |
| Search | **Postgres FTS** (fase 1) → **Meilisearch** (fase 2) | Busca instantânea de produto |
| Cache | **Next ISR** + **Upstash Redis** (sessão/cart) | Performance global |

---

## 3. ARQUITETURA DE ROTAS

### Storefront (público)
```
/                                  Home
/categoria/[slug]                  NEX FUT, NEX FIT, etc (PLP)
/produto/[slug]                    PDP
/colecao/[slug]                    Coleções curadas (Semana NEX, Mais Vendidos)
/busca?q=...                       Resultados
/carrinho                          Mini-cart + página
/checkout                          Multi-step (endereço → frete → pagamento)
/conta                             Login/cadastro cliente
/conta/pedidos                     Histórico
/conta/pedidos/[id]                Detalhe + rastreio
/conta/enderecos                   CRUD endereço
/conta/favoritos                   Wishlist
/sobre /comunidade /blog           Institucional
/ajuda /trocas /contato            Suporte
/politica-privacidade /termos      Legal
```

### Admin (privado — /admin)
```
/admin/login
/admin/dashboard                   KPIs: faturamento dia/mês, pedidos, ticket médio, conversão
/admin/pedidos                     Lista + filtros (status, pagamento, período)
/admin/pedidos/[id]                Detalhe pedido + status timeline + notas + nota fiscal
/admin/produtos                    Lista + busca + filtro categoria
/admin/produtos/novo
/admin/produtos/[id]               Editor (variantes, imagens, SEO, estoque)
/admin/categorias                  CRUD + reordenar (drag&drop)
/admin/colecoes                    Manual ou regras (ex: "preço > R$300")
/admin/clientes                    Lista + LTV + último pedido
/admin/clientes/[id]               Perfil completo
/admin/cupons                      Códigos, % ou fixo, validade, limite
/admin/frete                       Tabela + integração Melhor Envio
/admin/conteudo                    Banners hero, blocos editáveis
/admin/marketing                   Email broadcasts, abandono carrinho
/admin/relatorios                  Vendas por categoria/produto, estoque baixo
/admin/configuracoes               Loja, pagamento, frete, email, integrações
/admin/usuarios                    Equipe + permissões (RBAC)
```

### API
```
/api/cart                          POST/PATCH/DELETE
/api/checkout/quote                Cálculo frete + total
/api/checkout/create               Cria pedido + intent pagamento
/api/webhook/mercadopago           Status pagamento
/api/webhook/melhorenvio           Rastreio
/api/admin/...                     Endpoints admin (protegidos)
```

---

## 4. MODELO DE DADOS (Postgres)

```
users (id, email, name, phone, cpf, role[customer|admin|staff], created_at)
addresses (id, user_id, label, cep, street, number, complement, city, state, default)
products (id, slug, title, description, brand, category_id, subcategory_id, status[draft|active|archived],
          base_price, sale_price, sku_root, weight_g, dims, seo_title, seo_desc, seo_image, created_at)
product_variants (id, product_id, sku, size, color, price_override, stock, image_id)
product_images (id, product_id, url, alt, position)
product_attributes (id, product_id, key, value)  -- material, tecnologia, gênero
categories (id, slug, name, parent_id, image, banner, position, seo_*)
collections (id, slug, name, type[manual|rule], rule_json, banner)
collection_products (collection_id, product_id, position)
coupons (id, code, type[percent|fixed|freeshipping], value, min_subtotal, max_uses, used, valid_from, valid_to)
carts (id, user_id?, session_id, created_at, abandoned_at)
cart_items (cart_id, variant_id, qty, unit_price)
orders (id, code, user_id, status, payment_status, shipping_status, subtotal, discount, shipping, total,
        coupon_code?, payment_method, payment_id, tracking_code, created_at)
order_items (order_id, variant_id, qty, unit_price, snapshot_json)
order_events (order_id, type, payload, created_at)  -- timeline
shipping_quotes (cart_id, carrier, service, price, days, response_json)
reviews (id, product_id, user_id, rating, title, body, status, created_at)
wishlists (user_id, product_id, created_at)
admin_audit (id, user_id, action, entity, entity_id, diff, created_at)
content_blocks (id, slot, json, active_from, active_to)  -- banners home
settings (key, value_json)
```

**RLS Supabase:** customer só vê próprios pedidos/endereços; staff vê tudo.

---

## 5. ESTRUTURA DE PASTAS

```
/app
  (storefront)/
    page.tsx                  Home
    categoria/[slug]/page.tsx
    produto/[slug]/page.tsx
    checkout/...
    conta/...
  (admin)/
    admin/layout.tsx          Sidebar + topbar
    admin/dashboard/page.tsx
    admin/produtos/...
  api/
/components
  ui/                         shadcn (button, sheet, dialog, sonner, etc)
  storefront/
    commerce-hero.tsx         (ADAPTADO do exemplo)
    product-card.tsx
    product-grid.tsx
    category-tiles.tsx
    mega-menu.tsx
    cart-drawer.tsx
    pdp-gallery.tsx
    checkout-stepper.tsx
  admin/
    data-table.tsx
    product-editor.tsx
    order-timeline.tsx
    image-uploader.tsx
    kpi-card.tsx
/lib
  db/                         drizzle schema, queries
  auth/
  payments/mercadopago.ts
  shipping/melhorenvio.ts
  validators/                 zod schemas
  utils/
/styles/globals.css
/scripts                      seed.ts, import-csv.ts
/drizzle                      migrations
```

---

## 6. DESIGN SYSTEM

**Tema (mantém DNA NEX, eleva):**
- Fundo: `#0A0F1E` (azul-quase-preto) com gradient sutil
- Primary: `#3B82F6` → `#60A5FA` (azul-cyan)
- Accent neon: `#22D3EE` (glow)
- Texto: `#F8FAFC` / muted `#94A3B8`
- Cards: `bg-white/[0.03]` + `backdrop-blur` + `border-white/10`
- Radius: `rounded-2xl` (cards), `rounded-full` (CTAs)

**Tipografia:**
- Display: Inter Tight ou Geist (h1/h2 bold/black)
- Body: Inter / Geist
- Mono (preços/SKU): JetBrains Mono

**Componentes-chave (mobile-first):**
- Hero adaptado do `CommerceHero` (referência fornecida) com tema dark NEX.
- Category tiles com PNG transparente do produto/esporte (igual o exemplo, mas com chuteira/raquete/tênis).
- Product card: imagem 1:1, badge canto (HOT/NOVO/-XX%), preço com strike, botão `+` flutuante (add ao carrinho).
- Mega-menu desktop, sheet/bottom-drawer mobile.
- Carrinho slide-over com mini-checkout.
- Stickybar mobile no PDP: "Adicionar — R$XXX".

---

## 7. SEÇÕES DA HOME (ordem mobile-first)

1. **Hero `CommerceHero` adaptado** — h1 "O universo esportivo da nova geração", CTA `EXPLORAR` + `VER OFERTAS`, métricas (8+ esportes, 500+ produtos, 4.9★).
2. **Category Tiles** (8 NEX verticals) — 2×4 mobile, 4×2 desktop, PNG transparente animado on hover.
3. **Produtos Destaque** — carrossel horizontal scroll mobile, grid 4-col desktop.
4. **Semana NEX (oferta com countdown)** — banner gradient + timer real.
5. **Mais Vendidos** — top 6 com badge TOP 1/2/3.
6. **Achados da Semana** — editorial card grande + 3 menores.
7. **Esportes em Destaque** — bento grid com contadores.
8. **Parceiros NEX** — marquee infinito com logos das marcas.
9. **Newsletter + footer** — captação email + redes.

---

## 8. PERFORMANCE TARGETS

| Métrica | Alvo |
|---|---|
| LCP | < 1.8s (mobile 4G) |
| INP | < 200ms |
| CLS | < 0.05 |
| Bundle inicial JS | < 90 KB gzip |
| Imagens | AVIF/WebP, lazy, `priority` só hero |
| Fonts | `next/font` self-host, swap |
| Lighthouse mobile | ≥ 95 perf, 100 a11y, 100 SEO |

Técnicas: RSC default, `use client` só onde precisa interatividade, ISR 60s pro PLP/PDP, edge runtime nas rotas de leitura.

---

## 9. SEO / ANALYTICS

- `generateMetadata` em todas as rotas dinâmicas.
- Schema.org `Product`, `BreadcrumbList`, `Organization`, `Offer`, `AggregateRating`.
- `sitemap.xml` dinâmico (produtos + categorias).
- `robots.txt` com bloqueio admin.
- OpenGraph dinâmico via `next/og` (image-by-id).
- GA4 + Meta Pixel + GTM + PostHog (events: view_item, add_to_cart, begin_checkout, purchase).
- llms.txt (citabilidade IA).

---

## 10. PAINEL ADMIN — FEATURES NUVEMSHOP-STYLE

**Dashboard:**
- KPI cards: vendas hoje/7d/30d, ticket médio, conversão, pedidos pendentes, estoque baixo.
- Gráficos: receita por dia (linha), top categorias (donut), funil (sessões → cart → checkout → pago).

**Pedidos:**
- Tabela com filtros (status, pagamento, data, valor).
- Detalhe com timeline (criado → pago → preparando → enviado → entregue).
- Ações: imprimir etiqueta (Melhor Envio), gerar NF (integração futura), cancelar/estornar, marcar enviado, anexar nota interna.
- Bulk actions (etiquetar 20 pedidos de uma vez).

**Produtos:**
- Editor com tabs: básico, mídia (drag&drop, reorder, AI alt-text), preço, estoque (variantes via grid tamanho×cor), SEO, atributos, organização (categorias/coleções).
- Duplicar produto, importar CSV, exportar.
- Status: rascunho / ativo / arquivado.

**Clientes:**
- LTV, # pedidos, último pedido, segmento (novo/recorrente/VIP).
- Histórico de pedidos + notas internas.
- Exportar CSV (RGPD-safe).

**Marketing:**
- Cupons (% / fixo / frete grátis, regras de uso).
- Banner editor (slot da home, drag PNG, CTA, validade).
- Recuperação de carrinho abandonado (email automático 1h/24h/72h).

**Configurações:**
- Loja (nome, logo, favicon, social, contato).
- Pagamento (chaves MP), Frete (chaves Melhor Envio + tabela manual fallback).
- Email (Resend key, templates editáveis).
- Equipe + permissões (admin/staff/financeiro).

**Auditoria:** todo CRUD logado em `admin_audit` (quem mudou o quê e quando).

---

## 11. ROADMAP DE EXECUÇÃO (4 ondas)

### ONDA 0 — Setup (eu, Opus, faço sozinho)
- Inicializar Next 15 + Tailwind v4 + shadcn + Drizzle + Supabase.
- Estrutura de pastas, env, ESLint/Prettier.
- Tema/tokens NEX no `globals.css`.
- Componentes base shadcn instalados.
- Schema Drizzle completo + primeira migration.
- Seed com 20 produtos demo cobrindo 8 categorias.

### ONDA 1 — Storefront público (delego pane KHPb7gPu, partes mais simples)
- Layout root (nav + footer).
- Home (hero `CommerceHero` adaptado + 8 seções).
- PLP `/categoria/[slug]` com filtros (preço, tamanho, marca, ordenação).
- PDP `/produto/[slug]` com galeria, variantes, add-to-cart, reviews.
- Cart drawer + página `/carrinho`.

### ONDA 2 — Checkout + Auth + Conta (eu faço, parte sensível)
- Auth Supabase (login social + email).
- Checkout multi-step (endereço CEP autocomplete → frete Melhor Envio → pagamento MP/Pix).
- Webhook Mercado Pago + atualização status.
- Páginas `/conta/*` (pedidos, endereços, favoritos).
- Email transacional (Resend + React Email): confirmação, pago, enviado, entregue.

### ONDA 3 — Admin (eu, é o pesado e crítico)
- Auth admin separada + RBAC.
- Dashboard com KPIs + gráficos (Recharts).
- CRUD produtos com editor completo + uploader Supabase Storage.
- Gestão pedidos com timeline + ações.
- Clientes, cupons, banners, configurações.
- Auditoria de alterações.

### ONDA 4 — Polimento (delego pane)
- SEO completo + sitemap + schema.
- Analytics (GA4/Pixel/PostHog).
- Recuperação carrinho abandonado.
- Testes E2E Playwright dos fluxos críticos.
- Lighthouse audit + ajustes.
- Deploy Cloudflare Pages + DNS.

---

## 12. DIVISÃO DE TRABALHO

**Eu (Opus, orquestrador + executor pesado):**
- Setup completo do projeto + DB schema + migrations + seed.
- Toda a Onda 2 (checkout, pagamento, webhooks) — risco alto, dinheiro envolvido.
- Toda a Onda 3 (admin completo) — lógica de negócio crítica.
- Code review de tudo que o pane entregar.
- Arquitetura, decisões de stack, integrações.

**Pane KHPb7gPu (MIMO 2.5 Pro, executor):**
- Componentes UI puros (cards, grids, marquee, tiles).
- Páginas estáticas (sobre, ajuda, política).
- Home + PLP + PDP (a partir de specs minhas, com mocks até o DB ficar pronto).
- Polimento visual, responsividade, micro-animações.
- Testes E2E Playwright dos fluxos.

---

## 13. ENTREGA / DEPLOY

- **Staging:** `nex-staging.codigozero.app` (Cloudflare Pages preview).
- **Prod:** `nexsportts.com.br` (substituir DNS quando cliente aprovar).
- Plano de migração: rodar paralelo 1 semana, importar pedidos legados (se houver), migrar DNS em janela noturna.
- Backup automático DB diário (Supabase) + snapshot semanal externo (R2).

---

## 14. RISCOS + MITIGAÇÃO

| Risco | Mitigação |
|---|---|
| Cliente não tem catálogo digital pronto | Painel admin pra cadastrar; oferecer import CSV |
| Integração Mercado Pago em sandbox vs prod | Webhook testado com ngrok antes do go-live |
| SEO perdendo ranking na migração | 301 de todas URLs antigas → novas; sitemap submetido |
| Estoque dessincronizado | Lock pessimista no checkout; reserva 15min |
| Pagamento aprovado sem estoque | Validação atômica antes de criar order |

---

## PRÓXIMO PASSO

Aprova o plano? Se sim, na sequência:
1. Crio TaskList com as 4 ondas.
2. Executo Onda 0 (setup completo do projeto).
3. Delego Onda 1 ao pane KHPb7gPu com specs detalhadas por componente.
4. Te reporto a cada milestone fechado.
