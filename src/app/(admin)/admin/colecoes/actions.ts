"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { requireAdmin } from "@/lib/auth/admin";
import { auditLog } from "@/lib/auth/audit";
import { revalidatePath } from "next/cache";

const collectionSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(120),
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/, "Slug: lowercase, números e hífen"),
  type: z.enum(["manual", "rule"]),
  position: z.coerce.number().int().min(0),
  active: z.coerce.boolean(),
});

export async function createCollection(formData: FormData) {
  const user = await requireAdmin();
  const parsed = collectionSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    type: formData.get("type") ?? "manual",
    position: formData.get("position") ?? 0,
    active: formData.get("active") === "true",
  });

  const { data, error } = await supabaseAdmin
    .from("collections")
    .insert({
      name: parsed.name,
      slug: parsed.slug,
      type: parsed.type,
      position: parsed.position,
      active: parsed.active,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await auditLog({ userId: user.id, action: "create", entity: "collection", entityId: data.id, diff: parsed as Record<string, unknown> });
  revalidatePath("/admin/colecoes");
}

export async function updateCollection(id: string, formData: FormData) {
  const user = await requireAdmin();
  const parsed = collectionSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    type: formData.get("type") ?? "manual",
    position: formData.get("position") ?? 0,
    active: formData.get("active") === "true",
  });

  const { error } = await supabaseAdmin
    .from("collections")
    .update({
      name: parsed.name,
      slug: parsed.slug,
      type: parsed.type,
      position: parsed.position,
      active: parsed.active,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await auditLog({ userId: user.id, action: "update", entity: "collection", entityId: id, diff: parsed as Record<string, unknown> });
  revalidatePath("/admin/colecoes");
}

export async function deleteCollection(id: string) {
  const user = await requireAdmin();

  const { error } = await supabaseAdmin.from("collections").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await auditLog({ userId: user.id, action: "delete", entity: "collection", entityId: id });
  revalidatePath("/admin/colecoes");
}

export async function addProductToCollection(collectionId: string, productId: string) {
  const user = await requireAdmin();

  const { error } = await supabaseAdmin
    .from("collection_products")
    .insert({ collection_id: collectionId, product_id: productId });

  if (error) throw new Error(error.message);

  await auditLog({ userId: user.id, action: "add_product", entity: "collection", entityId: collectionId, diff: { productId } });
  revalidatePath("/admin/colecoes");
}

export async function removeProductFromCollection(collectionId: string, productId: string) {
  const user = await requireAdmin();

  const { error } = await supabaseAdmin
    .from("collection_products")
    .delete()
    .eq("collection_id", collectionId)
    .eq("product_id", productId);

  if (error) throw new Error(error.message);

  await auditLog({ userId: user.id, action: "remove_product", entity: "collection", entityId: collectionId, diff: { productId } });
  revalidatePath("/admin/colecoes");
}

export async function searchProducts(query: string) {
  await requireAdmin();

  const { data } = await supabaseAdmin
    .from("products")
    .select("id, name, slug, price")
    .ilike("name", `%${query}%`)
    .limit(10);

  return data ?? [];
}
