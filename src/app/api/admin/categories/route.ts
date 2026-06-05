import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";
import { auditLog } from "@/lib/auth/audit";

const createCategorySchema = z.object({
  slug: z.string().min(1).max(80),
  name: z.string().min(1).max(120),
  parentId: z.string().uuid().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),
  position: z.number().int().default(0),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().optional(),
});

export async function GET() {
  await assertAdmin();

  const rows = await db.query.categories.findMany({
    orderBy: asc(categories.position),
  });

  return jsonOk(rows);
}

export async function POST(req: Request) {
  const user = await assertAdmin();
  const body = await req.json();
  const parsed = createCategorySchema.safeParse(body);

  if (!parsed.success) return jsonErr(parsed.error.issues[0].message);

  const existing = await db.query.categories.findFirst({
    where: eq(categories.slug, parsed.data.slug),
  });
  if (existing) return jsonErr("Slug já existe", 409);

  const [created] = await db.insert(categories).values(parsed.data).returning();

  await auditLog({ userId: user.id, action: "create", entity: "category", entityId: created.id });

  return jsonOk(created, 201);
}
