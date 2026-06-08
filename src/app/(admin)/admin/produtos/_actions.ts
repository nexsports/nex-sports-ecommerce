"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const sb = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

const productSchema = z.object({
  title: z.string().min(1, "Título obrigatório").max(200),
  slug: z.string().min(1, "Slug obrigatório").max(200),
  brand: z.string().max(80).optional().nullable(),
  description: z.string().optional().nullable(),
  categoryId: z.string().uuid("Selecione uma categoria"),
  status: z.enum(["draft", "active", "archived"]).default("active"),
  basePriceCents: z.number().int().min(1, "Preço deve ser positivo"),
  salePriceCents: z.number().int().min(0).nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  stock: z.number().int().min(0).default(0),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

function revalidateAll() {
  revalidatePath("/admin/produtos");
  revalidatePath("/");
  revalidatePath("/busca");
}

export async function createProduct(
  values: ProductFormValues
): Promise<ActionResult> {
  try {
    const parsed = productSchema.safeParse(values);
    if (!parsed.success)
      return { ok: false, error: parsed.error.issues[0].message };
    const v = parsed.data;

    const { data: prod, error } = await sb()
      .from("products")
      .insert({
        title: v.title,
        slug: v.slug,
        brand: v.brand || null,
        description: v.description || null,
        category_id: v.categoryId,
        status: v.status,
        base_price: v.basePriceCents,
        sale_price: v.salePriceCents ?? null,
      })
      .select("id")
      .single();
    if (error || !prod)
      return { ok: false, error: error?.message ?? "Erro ao criar" };

    if (v.imageUrl) {
      await sb().from("product_images").insert({
        product_id: prod.id,
        url: v.imageUrl,
        position: 0,
      });
    }
    if (v.stock > 0) {
      await sb().from("product_variants").insert({
        product_id: prod.id,
        sku: v.slug.toUpperCase().slice(0, 30),
        size: "Único",
        color: "Padrão",
        stock: v.stock,
      });
    }

    revalidateAll();
    return { ok: true, id: prod.id };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro inesperado";
    console.error("[createProduct]", msg);
    return { ok: false, error: msg };
  }
}

export async function updateProduct(
  id: string,
  values: ProductFormValues
): Promise<ActionResult> {
  try {
    const parsed = productSchema.safeParse(values);
    if (!parsed.success)
      return { ok: false, error: parsed.error.issues[0].message };
    const v = parsed.data;

    const { error } = await sb()
      .from("products")
      .update({
        title: v.title,
        slug: v.slug,
        brand: v.brand || null,
        description: v.description || null,
        category_id: v.categoryId,
        status: v.status,
        base_price: v.basePriceCents,
        sale_price: v.salePriceCents ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };

    if (v.imageUrl) {
      await sb().from("product_images").delete().eq("product_id", id);
      await sb().from("product_images").insert({
        product_id: id,
        url: v.imageUrl,
        position: 0,
      });
    }

    const { data: existingVar } = await sb()
      .from("product_variants")
      .select("id")
      .eq("product_id", id)
      .limit(1)
      .maybeSingle();
    if (existingVar) {
      await sb()
        .from("product_variants")
        .update({ stock: v.stock })
        .eq("id", existingVar.id);
    } else if (v.stock > 0) {
      await sb().from("product_variants").insert({
        product_id: id,
        sku: v.slug.toUpperCase().slice(0, 30),
        size: "Único",
        color: "Padrão",
        stock: v.stock,
      });
    }

    revalidateAll();
    return { ok: true, id };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro inesperado";
    console.error("[updateProduct]", msg);
    return { ok: false, error: msg };
  }
}

export async function deleteProduct(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    await sb().from("product_images").delete().eq("product_id", id);
    await sb().from("product_variants").delete().eq("product_id", id);
    const { error } = await sb().from("products").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidateAll();
    return { ok: true };
  } catch (e: unknown) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Erro inesperado",
    };
  }
}

export async function bulkDeleteProducts(
  ids: string[]
): Promise<{ ok: boolean; deleted?: number; error?: string }> {
  try {
    if (!ids.length) return { ok: true, deleted: 0 };
    await sb().from("product_images").delete().in("product_id", ids);
    await sb().from("product_variants").delete().in("product_id", ids);
    const { error, count } = await sb()
      .from("products")
      .delete({ count: "exact" })
      .in("id", ids);
    if (error) return { ok: false, error: error.message };
    revalidateAll();
    return { ok: true, deleted: count ?? ids.length };
  } catch (e: unknown) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Erro inesperado",
    };
  }
}
