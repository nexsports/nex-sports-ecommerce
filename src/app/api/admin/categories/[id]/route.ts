import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";
import { auditLog } from "@/lib/auth/audit";

const updateCategorySchema = z.object({
  slug: z.string().min(1).max(80).optional(),
  name: z.string().min(1).max(120).optional(),
  parentId: z.string().uuid().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),
  position: z.number().int().optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  await assertAdmin();
  const { id } = await params;

  const category = await db.query.categories.findFirst({
    where: eq(categories.id, id),
  });

  if (!category) return jsonErr("Categoria não encontrada", 404);
  return jsonOk(category);
}

export async function PATCH(req: Request, { params }: Params) {
  const user = await assertAdmin();
  const { id } = await params;
  const body = await req.json();
  const parsed = updateCategorySchema.safeParse(body);

  if (!parsed.success) return jsonErr(parsed.error.issues[0].message);

  const existing = await db.query.categories.findFirst({ where: eq(categories.id, id) });
  if (!existing) return jsonErr("Categoria não encontrada", 404);

  if (parsed.data.slug && parsed.data.slug !== existing.slug) {
    const slugTaken = await db.query.categories.findFirst({
      where: eq(categories.slug, parsed.data.slug),
    });
    if (slugTaken) return jsonErr("Slug já existe", 409);
  }

  const [updated] = await db
    .update(categories)
    .set(parsed.data)
    .where(eq(categories.id, id))
    .returning();

  await auditLog({ userId: user.id, action: "update", entity: "category", entityId: id, diff: parsed.data });

  return jsonOk(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await assertAdmin();
  const { id } = await params;

  const existing = await db.query.categories.findFirst({ where: eq(categories.id, id) });
  if (!existing) return jsonErr("Categoria não encontrada", 404);

  await db.delete(categories).where(eq(categories.id, id));

  await auditLog({ userId: user.id, action: "delete", entity: "category", entityId: id });

  return jsonOk({ deleted: true });
}
