import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";
import { auditLog } from "@/lib/auth/audit";

const createCollectionSchema = z.object({
  slug: z.string().min(1).max(80),
  name: z.string().min(1).max(120),
  type: z.enum(["manual", "rule"]).default("manual"),
  ruleJson: z.unknown().optional(),
  bannerUrl: z.string().nullable().optional(),
  position: z.number().int().default(0),
  active: z.boolean().default(true),
});

export async function GET() {
  await assertAdmin();

  const rows = await db.query.collections.findMany({
    orderBy: asc(collections.position),
  });

  return jsonOk(rows);
}

export async function POST(req: Request) {
  const user = await assertAdmin();
  const body = await req.json();
  const parsed = createCollectionSchema.safeParse(body);

  if (!parsed.success) return jsonErr(parsed.error.issues[0].message);

  const existing = await db.query.collections.findFirst({
    where: eq(collections.slug, parsed.data.slug),
  });
  if (existing) return jsonErr("Slug já existe", 409);

  const [created] = await db.insert(collections).values({
    ...parsed.data,
    ruleJson: parsed.data.ruleJson ?? null,
  }).returning();

  await auditLog({ userId: user.id, action: "create", entity: "collection", entityId: created.id });

  return jsonOk(created, 201);
}
