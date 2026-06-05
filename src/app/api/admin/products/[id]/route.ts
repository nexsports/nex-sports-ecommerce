import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { products, productImages, productVariants, productAttributes } from "@/lib/db/schema";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";
import { auditLog } from "@/lib/auth/audit";

const updateProductSchema = z.object({
  slug: z.string().min(1).max(200).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  brand: z.string().max(80).optional(),
  categoryId: z.string().uuid().nullable().optional(),
  status: z.enum(["draft", "active", "archived"]).optional(),
  basePrice: z.number().int().positive().optional(),
  salePrice: z.number().int().positive().nullable().optional(),
  skuRoot: z.string().max(60).optional(),
  weightG: z.number().int().nullable().optional(),
  lengthCm: z.number().int().nullable().optional(),
  widthCm: z.number().int().nullable().optional(),
  heightCm: z.number().int().nullable().optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().optional(),
  seoImage: z.string().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  await assertAdmin();
  const { id } = await params;

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      images: { orderBy: productImages.position },
      variants: true,
      attributes: true,
      category: true,
    },
  });

  if (!product) return jsonErr("Produto não encontrado", 404);
  return jsonOk(product);
}

export async function PATCH(req: Request, { params }: Params) {
  const user = await assertAdmin();
  const { id } = await params;
  const body = await req.json();
  const parsed = updateProductSchema.safeParse(body);

  if (!parsed.success) return jsonErr(parsed.error.issues[0].message);

  const existing = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!existing) return jsonErr("Produto não encontrado", 404);

  // Check slug uniqueness if changing
  if (parsed.data.slug && parsed.data.slug !== existing.slug) {
    const slugTaken = await db.query.products.findFirst({
      where: eq(products.slug, parsed.data.slug),
    });
    if (slugTaken) return jsonErr("Slug já existe", 409);
  }

  const [updated] = await db
    .update(products)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();

  await auditLog({ userId: user.id, action: "update", entity: "product", entityId: id, diff: parsed.data });

  return jsonOk(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await assertAdmin();
  const { id } = await params;

  const existing = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!existing) return jsonErr("Produto não encontrado", 404);

  await db.delete(products).where(eq(products.id, id));

  await auditLog({ userId: user.id, action: "delete", entity: "product", entityId: id });

  return jsonOk({ deleted: true });
}
