/**
 * Seed via Supabase REST (PostgREST) using service_role.
 * Works without DATABASE_URL — only requires SUPABASE_SERVICE_ROLE_KEY.
 * Run AFTER applying migration 0000 in Supabase SQL editor.
 *
 *   npx tsx scripts/seed-via-rest.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
import ws from "ws";
import { createClient } from "@supabase/supabase-js";
// shim WebSocket for Node 20 (supabase-js realtime peer dep)
(globalThis as any).WebSocket ??= ws;

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!URL || !KEY) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(URL, KEY, { auth: { persistSession: false } });

const CATEGORIES = [
  { slug: "nex-fut",   name: "NEX FUT",   image_url: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&q=80", position: 0 },
  { slug: "nex-fit",   name: "NEX FIT",   image_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80", position: 1 },
  { slug: "nex-beach", name: "NEX BEACH", image_url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80", position: 2 },
  { slug: "nex-padel", name: "NEX PADEL", image_url: "https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?w=600&q=80", position: 3 },
  { slug: "nex-run",   name: "NEX RUN",   image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80", position: 4 },
  { slug: "nex-court", name: "NEX COURT", image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80", position: 5 },
  { slug: "nex-style", name: "NEX STYLE", image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", position: 6 },
  { slug: "nex-tech",  name: "NEX TECH",  image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", position: 7 },
];

type SeedProduct = {
  slug: string; title: string; brand: string; categorySlug: string;
  basePrice: number; salePrice?: number; description: string;
  images: string[]; sizes?: string[]; colors?: string[]; stock?: number;
};

const PRODUCTS: SeedProduct[] = [
  { slug: "camisa-pro-match-elite", title: "Camisa Pro Match Elite", brand: "Nike", categorySlug: "nex-fut", basePrice: 24900, salePrice: 18900, stock: 50, description: "Camisa de jogo com tecnologia Dri-FIT ADV, gola V em rib, tecido com 92% poliéster reciclado.", images: ["https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=800&q=80"], sizes: ["P","M","G","GG"], colors: ["Azul","Preto"] },
  { slug: "chuteira-speed-carbon", title: "Chuteira Speed Carbon FG", brand: "Adidas", categorySlug: "nex-fut", basePrice: 49900, salePrice: 34900, stock: 35, description: "Cabedal Primeknit, placa de carbono pra trava firme, peso 195g.", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"], sizes: ["38","39","40","41","42","43"], colors: ["Preto","Branco"] },
  { slug: "meiao-pro-stripe", title: "Meião Pro Stripe", brand: "Puma", categorySlug: "nex-fut", basePrice: 5900, stock: 200, description: "Meião profissional com compressão na panturrilha.", images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"], sizes: ["35-38","39-42","43-46"], colors: ["Preto","Branco","Azul"] },
  { slug: "dry-fit-compression-x", title: "Dry Fit Compression X", brand: "Under Armour", categorySlug: "nex-fit", basePrice: 11900, salePrice: 8900, stock: 80, description: "Camiseta de compressão com tecnologia HeatGear.", images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"], sizes: ["P","M","G","GG"], colors: ["Preto","Cinza","Branco"] },
  { slug: "shorts-train-flex", title: "Shorts Train Flex 7\"", brand: "Nike", categorySlug: "nex-fit", basePrice: 14900, stock: 60, description: "Shorts de treino com bolso traseiro com zíper.", images: ["https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"], sizes: ["P","M","G","GG"], colors: ["Preto","Verde militar"] },
  { slug: "luva-grip-pro", title: "Luva Grip Pro Crossfit", brand: "Mizuno", categorySlug: "nex-fit", basePrice: 7900, stock: 40, description: "Luva com palma antiderrapante e proteção em punho.", images: ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80"], sizes: ["P","M","G"], colors: ["Preto"] },
  { slug: "raquete-beach-tennis-elite", title: "Raquete Beach Tennis Elite", brand: "Wilson", categorySlug: "nex-beach", basePrice: 89900, salePrice: 64900, stock: 25, description: "Carbono 18K, frame eva soft, balanço médio.", images: ["https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80"], sizes: ["Único"], colors: ["Azul/Cyan"] },
  { slug: "sunga-pro-swim", title: "Sunga Pro Swim Slim", brand: "Adidas", categorySlug: "nex-beach", basePrice: 12900, stock: 80, description: "Sunga slim com cordão interno e tecnologia Infinitex.", images: ["https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80"], sizes: ["P","M","G","GG"], colors: ["Preto","Azul","Branco"] },
  { slug: "oculos-solar-sport-uv", title: "Óculos Solar Sport UV400", brand: "Mizuno", categorySlug: "nex-beach", basePrice: 24900, stock: 50, description: "Lente polarizada, proteção UV400, armação TR90 leve.", images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80"], sizes: ["Único"], colors: ["Preto","Azul espelhado"] },
  { slug: "raquete-padel-pro-diamond", title: "Raquete Padel Pro Diamond", brand: "Wilson", categorySlug: "nex-padel", basePrice: 69900, salePrice: 52000, stock: 20, description: "Formato diamante, EVA Hard, fibra de carbono.", images: ["https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?w=800&q=80"], sizes: ["Único"], colors: ["Preto/Azul"] },
  { slug: "bolsa-padel-tour", title: "Bolsa Padel Tour 6", brand: "Adidas", categorySlug: "nex-padel", basePrice: 39900, stock: 30, description: "Bolsa térmica pra 6 raquetes, compartimento isolado pra calçados.", images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"], sizes: ["Único"], colors: ["Preto"] },
  { slug: "bola-padel-pro-cano", title: "Bolas Padel Pro (cano c/ 3)", brand: "Wilson", categorySlug: "nex-padel", basePrice: 4900, stock: 200, description: "Bolas oficiais aprovadas FIP, pressão constante.", images: ["https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80"], sizes: ["Único"], colors: ["Amarelo"] },
  { slug: "tenis-ultra-boost-run", title: "Tênis Ultra Boost Run", brand: "Adidas", categorySlug: "nex-run", basePrice: 74900, salePrice: 58900, stock: 60, description: "Cabedal Primeknit+, entressola Boost com responsividade total.", images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"], sizes: ["38","39","40","41","42","43","44"], colors: ["Preto","Branco"] },
  { slug: "regata-run-light", title: "Regata Run Light", brand: "Asics", categorySlug: "nex-run", basePrice: 9900, stock: 70, description: "Regata ultra leve com Cool Touch.", images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"], sizes: ["P","M","G","GG"], colors: ["Cinza","Amarelo neon"] },
  { slug: "relogio-run-gps", title: "Relógio Run GPS Pro", brand: "Garmin", categorySlug: "nex-run", basePrice: 159900, salePrice: 129900, stock: 15, description: "GPS multi-banda, autonomia 28h.", images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"], sizes: ["Único"], colors: ["Preto"] },
  { slug: "tenis-court-grip", title: "Tênis Court Grip Pro", brand: "Nike", categorySlug: "nex-court", basePrice: 64900, stock: 40, description: "Solado de borracha XDR pra quadras hard.", images: ["https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80"], sizes: ["38","39","40","41","42","43"], colors: ["Branco/Preto"] },
  { slug: "bola-basquete-nba-game", title: "Bola Basquete NBA Game", brand: "Wilson", categorySlug: "nex-court", basePrice: 39900, stock: 50, description: "Bola oficial NBA, couro composto.", images: ["https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80"], sizes: ["Oficial 7"], colors: ["Laranja"] },
  { slug: "raquete-tenis-blade-x", title: "Raquete Tênis Blade X", brand: "Wilson", categorySlug: "nex-court", basePrice: 89900, salePrice: 74900, stock: 18, description: "Tecnologia FortyFive°, 295g.", images: ["https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80"], sizes: ["L2","L3","L4"], colors: ["Preto/Verde"] },
  { slug: "oversized-tech-hoodie", title: "Oversized Tech Hoodie", brand: "Nike", categorySlug: "nex-style", basePrice: 37900, salePrice: 25900, stock: 45, description: "Moletom oversized com tecido Tech Fleece.", images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"], sizes: ["P","M","G","GG"], colors: ["Preto","Cinza","Bege"] },
  { slug: "mochila-urban-pro-30l", title: "Mochila Urban Pro 30L", brand: "Under Armour", categorySlug: "nex-style", basePrice: 27900, stock: 30, description: "30L, compartimento notebook 15.6\".", images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"], sizes: ["Único"], colors: ["Preto"] },
  { slug: "bone-fit-aba-curva", title: "Boné Fit Aba Curva", brand: "Puma", categorySlug: "nex-style", basePrice: 8900, stock: 100, description: "Boné estruturado, ajuste por velcro, dry-touch.", images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80"], sizes: ["Único"], colors: ["Preto","Branco","Azul"] },
  { slug: "smartwatch-sport-gps", title: "Smartwatch Sport GPS", brand: "Garmin", categorySlug: "nex-tech", basePrice: 99900, salePrice: 79900, stock: 25, description: "Tela AMOLED 1.4\", GPS, 50+ esportes, bateria 14 dias.", images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"], sizes: ["Único"], colors: ["Preto","Prata"] },
  { slug: "headphones-sport-bt", title: "Headphones Sport BT Pro", brand: "Sony", categorySlug: "nex-tech", basePrice: 54900, salePrice: 39900, stock: 35, description: "Bluetooth 5.3, ANC, IPX5, 30h de bateria.", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"], sizes: ["Único"], colors: ["Preto","Branco"] },
  { slug: "fone-tws-run-air", title: "Fone TWS Run Air", brand: "JBL", categorySlug: "nex-tech", basePrice: 29900, stock: 60, description: "Earbud true wireless, IPX7, encaixe esportivo seguro.", images: ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80"], sizes: ["Único"], colors: ["Preto"] },
];

async function main() {
  console.log("→ inserting categories…");
  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .upsert(CATEGORIES, { onConflict: "slug" })
    .select();
  if (catErr) throw catErr;
  const catBySlug = Object.fromEntries((cats ?? []).map((c: any) => [c.slug, c]));
  console.log(`  ${cats?.length ?? 0} categories`);

  console.log("→ inserting products…");
  for (const p of PRODUCTS) {
    const skuRoot = p.slug.toUpperCase().replace(/-/g, "_").slice(0, 30);
    const { data: prodArr, error: prodErr } = await supabase
      .from("products")
      .upsert({
        slug: p.slug,
        title: p.title,
        description: p.description,
        brand: p.brand,
        category_id: catBySlug[p.categorySlug].id,
        status: "active",
        base_price: p.basePrice,
        sale_price: p.salePrice ?? null,
        sku_root: skuRoot,
        weight_g: 500,
        seo_title: p.title,
        seo_description: p.description.slice(0, 160),
      }, { onConflict: "slug" })
      .select();
    if (prodErr) throw prodErr;
    const prod: any = prodArr![0];

    // images
    await supabase.from("product_images").delete().eq("product_id", prod.id);
    const { data: imgs, error: imgErr } = await supabase
      .from("product_images")
      .insert(p.images.map((url, idx) => ({ product_id: prod.id, url, alt: p.title, position: idx })))
      .select();
    if (imgErr) throw imgErr;
    const firstImgId = imgs?.[0]?.id ?? null;

    // variants (replace)
    await supabase.from("product_variants").delete().eq("product_id", prod.id);
    const sizes = p.sizes ?? ["Único"];
    const colors = p.colors ?? ["Padrão"];
    const perStock = Math.max(1, Math.floor((p.stock ?? 30) / (sizes.length * colors.length)));
    const variants = sizes.flatMap((size) =>
      colors.map((color) => ({
        product_id: prod.id,
        sku: `${skuRoot}-${size}-${color}`.replace(/\s+/g, "").slice(0, 80),
        size, color,
        stock: perStock,
        image_id: firstImgId,
      })),
    );
    const { error: varErr } = await supabase.from("product_variants").insert(variants);
    if (varErr) throw varErr;

    console.log(`  ✓ ${p.title} (${variants.length} variantes)`);
  }

  console.log("→ inserting coupon BEMVINDO10…");
  await supabase.from("coupons").upsert({
    code: "BEMVINDO10",
    type: "percent",
    value: 10,
    min_subtotal: 10000,
    max_uses: 1000,
    active: true,
  }, { onConflict: "code" });

  console.log("→ inserting featured collection…");
  const { data: colArr } = await supabase
    .from("collections")
    .upsert({ slug: "destaques", name: "Destaques", type: "manual", active: true }, { onConflict: "slug" })
    .select();
  const col: any = colArr![0];
  const featSlugs = ["camisa-pro-match-elite","chuteira-speed-carbon","dry-fit-compression-x","raquete-padel-pro-diamond","smartwatch-sport-gps","tenis-ultra-boost-run"];
  const { data: featProds } = await supabase.from("products").select("id,slug").in("slug", featSlugs);
  await supabase.from("collection_products").delete().eq("collection_id", col.id);
  await supabase.from("collection_products").insert(
    (featProds ?? []).map((p: any, i: number) => ({ collection_id: col.id, product_id: p.id, position: i })),
  );

  console.log("✓ done");
}

main().catch((e) => { console.error("✗", e); process.exit(1); });
