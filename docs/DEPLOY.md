# Deploy — NEX SPORTS

## Caminho recomendado: Cloudflare Pages (front) + Supabase (DB) + domínio na Hostinger

### 1. Conecta repo no Cloudflare Pages

1. Acessa https://dash.cloudflare.com → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Autoriza GitHub se necessário.
3. Seleciona o repositório `nexsports/nex-sports-ecommerce`.
4. **Set up builds and deployments:**
   - Project name: `nex-sports`
   - Production branch: `main`
   - Framework preset: **Next.js**
   - Build command: `npm run build`
   - Build output directory: `.next` (CF detecta sozinho via Pages adapter)
   - Root directory: `/`
5. **Environment variables** — adiciona os campos listados em `wrangler.toml`. Marca como "Secret" os SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SECRET_KEY, RESEND_API_KEY, MP_*, MELHORENVIO_TOKEN.
6. **Save and Deploy.** Demora ~3 min na primeira vez.
7. CF gera URL `https://nex-sports.pages.dev`. Cada `git push` faz redeploy.

### 2. Aponta domínio nexsportts.com.br (Hostinger) pro CF Pages

1. Cloudflare Pages → projeto → **Custom domains** → **Set up a custom domain** → digita `nexsportts.com.br`.
2. CF mostra os DNS records que você precisa criar:
   - `CNAME @ → nex-sports.pages.dev` (root, se Hostinger DNS aceitar CNAME at apex; caso contrário use ALIAS ou os 2 A records que CF informar)
   - `CNAME www → nex-sports.pages.dev`
3. Vai no painel Hostinger → **Hospedagem → Avançado → Editor de Zona DNS** → cria os records exatamente como CF instruiu.
4. Propaga em ~5 min. CF emite cert SSL automaticamente.
5. Pronto. `https://nexsportts.com.br` aponta pra Pages.

Opcional: mover NS pra Cloudflare (DNS completo gerido por eles) pra ter Page Rules + Workers + analytics. Não obrigatório.

---

## Caminho alternativo: Vercel

1. https://vercel.com/new → **Import Git Repository** → escolhe `nexsports/nex-sports-ecommerce`.
2. Framework: Next.js (auto-detect).
3. Mesmo bloco de env vars do `wrangler.toml`.
4. **Deploy.** URL `https://nex-sports-ecommerce.vercel.app`.
5. Pra apontar nexsportts.com.br: Vercel → Settings → Domains → Add → segue instruções DNS (Vercel também usa CNAME).

Trade-off: Vercel tem DX nativa Next mas custo escala mais rápido em produção (~$20/mês Pro mínimo se passar tier free).

---

## Caminho self-hosted: VPS Hostinger + Coolify

1. Cria VPS Hostinger (mín 2GB RAM).
2. Instala Coolify (https://coolify.io) via 1 comando.
3. No Coolify: **New Resource → Application → Git** → cola URL do repo + token deploy.
4. Build pack: Nixpacks (auto detecta Next.js).
5. Env vars idem.
6. Domain: aponta nexsportts.com.br → IP da VPS (A record), SSL via Coolify (Let's Encrypt).

Trade-off: você cuida do servidor (updates, monitoring, backup). ~$5-10/mês VPS.

---

## Banco — Supabase

Já configurado em `https://supabase.com/dashboard/project/jegcejiukimxabfufuto`. Não precisa redeploy. Vincula nas env vars do front (URL + keys) e pronto.

Pra environments separados (dev/staging/prod), crie 2 projetos Supabase. Hoje só temos 1 (dev = prod).

### Backup automático
Supabase fazm backup diário grátis (7 dias retidos no plano free). Pra retenção maior: plano Pro ($25/mês) → 7-30 dias + PITR.

---

## Próximo deploy seguindo este guia

1. Você abre CF Pages → connect repo → cola env vars → Deploy.
2. Me passa o URL `xxx.pages.dev`.
3. Atualizo o `NEXT_PUBLIC_SITE_URL` no `.env.local` + CF env vars pra apontar pro domínio final.
4. Você configura DNS Hostinger.
5. Vivo.
