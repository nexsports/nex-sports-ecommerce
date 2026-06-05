import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { products, productImages, productVariants, productAttributes } from "@/lib/db/schema";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";
import { auditLog } from "@/lib/auth/audit";

const createProductSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  brand: z.string().max(80).optional(),
  categoryId: z.string().uuid().optional(),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
  basePrice: z.number().int().positive(),
  salePrice: z.number().int().positive().optional(),
  skuRoot: z.string().max(60).optional(),
  weightG: z.number().int().optional(),
  lengthCm: z.number().int().optional(),
  widthCm: z.number().int().optional(),
  heightCm: z.number().int().optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().optional(),
  images: z.array(z.object({ url: z.string().url(), alt: z.string().optional() })).optional(),
  variants: z.array(z.object({
    sku: z.string().min(1).max(80),
    size: z.string().max(30).optional(),
    color: z.string().max(50).optional(),
    priceOverride: z.number().int().positive().optional(),
    stock: z.number().int().nonnegative().default(0),
  })).optional(),
});

export async function GET() {
  await assertAdmin();

  const rows = await db.query.products.findMany({
    orderBy: desc(products.createdAt),
    with: {
      images: { orderBy: productImages.position },
      variants: true,
      category: true,
    },
  });

  return jsonOk(rows);
}

export async function POST(req: Request) {
  const user = await assertAdmin();
  const body = await req.json();
  const parsed = createProductSchema.safeParse(body);

  if (!parsed.success) {
    return jsonErr(parsed.error.issues[0].message);
  }

  const { images, variants, ...productData } = parsed.data;

  // Check slug uniqueness
  const existing = await db.query.products.findFirst({
    where: eq(products.slug, productData.slug),
  });
  if (existing) return jsonErr("Slug já existe", 409);

  const [created] = await db.insert(products).values(productData).returning();

  if (images?.length) {
    await db.insert(productImages).values(
      images.map((img, i) => ({
        productId: created.id,
        url: img.url,
        alt: img.alt ?? null,
        position: i,
      })),
    );
  }

  if (variants?.length) {
    await db.insert(productVariants).values(
      variants.map((v) => ({
        productId: created.id,
        sku: v.sku,
        size: v.size ?? null,
        color: v.color ?? null,
        priceOverride: v.priceOverride ?? null,
        stock: v.stock,
      })),
    );
  }

  await auditLog({ userId: user.id, action: "create", entity: "product", entityId: created.id });

  return jsonOk(created, 201);
}
