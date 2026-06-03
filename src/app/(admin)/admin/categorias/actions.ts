"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { requireAdmin } from "@/lib/auth/admin";
import { auditLog } from "@/lib/auth/audit";
import { revalidatePath } from "next/cache";

const categorySchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(120),
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/, "Slug: lowercase, números e hífen"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  position: z.coerce.number().int().min(0),
  seoTitle: z.string().max(200).optional().or(z.literal("")),
  seoDescription: z.string().optional().or(z.literal("")),
});

export async function createCategory(formData: FormData) {
  const user = await requireAdmin();
  const parsed = categorySchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    imageUrl: formData.get("imageUrl") || "",
    position: formData.get("position") ?? 0,
    seoTitle: formData.get("seoTitle") || "",
    seoDescription: formData.get("seoDescription") || "",
  });

  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert({
      name: parsed.name,
      slug: parsed.slug,
      image_url: parsed.imageUrl || null,
      position: parsed.position,
      seo_title: parsed.seoTitle || null,
      seo_description: parsed.seoDescription || null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await auditLog({ userId: user.id, action: "create", entity: "category", entityId: data.id, diff: parsed as Record<string, unknown> });
  revalidatePath("/admin/categorias");
}

export async function updateCategory(id: string, formData: FormData) {
  const user = await requireAdmin();
  const parsed = categorySchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    imageUrl: formData.get("imageUrl") || "",
    position: formData.get("position") ?? 0,
    seoTitle: formData.get("seoTitle") || "",
    seoDescription: formData.get("seoDescription") || "",
  });

  const { error } = await supabaseAdmin
    .from("categories")
    .update({
      name: parsed.name,
      slug: parsed.slug,
      image_url: parsed.imageUrl || null,
      position: parsed.position,
      seo_title: parsed.seoTitle || null,
      seo_description: parsed.seoDescription || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await auditLog({ userId: user.id, action: "update", entity: "category", entityId: id, diff: parsed as Record<string, unknown> });
  revalidatePath("/admin/categorias");
}

export async function deleteCategory(id: string) {
  const user = await requireAdmin();

  const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await auditLog({ userId: user.id, action: "delete", entity: "category", entityId: id });
  revalidatePath("/admin/categorias");
}

export async function updateCategoryPosition(id: string, position: number) {
  await requireAdmin();
  const { error } = await supabaseAdmin.from("categories").update({ position }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categorias");
}
