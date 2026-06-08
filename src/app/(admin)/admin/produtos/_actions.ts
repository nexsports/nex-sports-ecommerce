"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { getAdminUser } from "@/lib/auth/admin";
import { auditLog } from "@/lib/auth/audit";

const productSchema = z.object({
  title: z.string().min(1, "Título obrigatório").max(200),
  slug: z.string().min(1, "Slug obrigatório").max(200),
  brand: z.string().max(80).optional().default(""),
  description: z.string().optional().default(""),
  categoryId: z.string().uuid("Categoria inválida"),
  status: z.enum(["draft", "active", "archived"]),
  gender: z.string().optional().default(""),
  badge: z.string().optional().default(""),
  basePrice: z.number().int().min(0, "Preço deve ser positivo"),
  salePrice: z.number().int().min(0).nullable().optional(),
  skuRoot: z.string().max(60).optional().default(""),
  seoTitle: z.string().max(200).optional().default(""),
  seoDescription: z.string().optional().default(""),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ActionResult {
  error?: string;
  id?: string;
}

export async function createProduct(
  formData: ProductFormValues,
  images: { url: string; alt: string; position: number }[],
  variants: { size: string; color: string; stock: number; sku: string }[]
): Promise<ActionResult> {
  try {
    console.log("[createProduct] start", { title: formData.title, slug: formData.slug });

    const user = await getAdminUser();
    if (!user) return { error: "Não autenticado" };

    const parsed = productSchema.safeParse(formData);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const data = parsed.data;

    console.log("[createProduct] inserting product", { title: data.title, categoryId: data.categoryId, basePrice: data.basePrice });
    const { data: product, error: prodErr } = await supabaseAdmin
      .from("products")
      .insert({
        title: data.title,
        slug: data.slug,
        brand: data.brand || null,
        description: data.description || null,
        category_id: data.categoryId,
        status: data.status,
        base_price: data.basePrice,
        sale_price: data.salePrice ?? null,
        sku_root: data.skuRoot || null,
        seo_title: data.seoTitle || null,
        seo_description: data.seoDescription || null,
        gender: data.gender || null,
        badge: data.badge || null,
      })
      .select("id")
      .single();

    if (prodErr || !product) {
      console.error("[createProduct] product insert failed", prodErr);
      return { error: prodErr?.message ?? "Erro ao criar produto" };
    }

    console.log("[createProduct] product created", { id: product.id });

    // Insert images
    if (images.length > 0) {
      console.log("[createProduct] inserting images", { count: images.length });
      const { error: imgErr } = await supabaseAdmin
        .from("product_images")
        .insert(
          images.map((img) => ({
            product_id: product.id,
            url: img.url,
            alt: img.alt || null,
            position: img.position,
          }))
        );
      if (imgErr) {
        console.error("[createProduct] image insert failed", imgErr);
        return { error: `Produto criado, mas erro nas imagens: ${imgErr.message}` };
      }
    }

    // Insert variants
    if (variants.length > 0) {
      console.log("[createProduct] inserting variants", { count: variants.length });
      const { error: varErr } = await supabaseAdmin
        .from("product_variants")
        .insert(
          variants.map((v) => ({
            product_id: product.id,
            sku: v.sku,
            size: v.size,
            color: v.color,
            stock: v.stock,
          }))
        );
      if (varErr) {
        console.error("[createProduct] variant insert failed", varErr);
        return { error: `Produto criado, mas erro nas variantes: ${varErr.message}` };
      }
    }

    console.log("[createProduct] success", { id: product.id });

    await auditLog({
      userId: user.id,
      action: "create",
      entity: "products",
      entityId: product.id,
      diff: data,
    });

    revalidatePath("/admin/produtos");
    return { id: product.id };
  } catch (e) {
    console.error("[createProduct] unexpected error", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado ao criar produto" };
  }
}

export async function updateProduct(
  id: string,
  formData: ProductFormValues,
  images: { url: string; alt: string; position: number }[],
  variants: { id?: string; size: string; color: string; stock: number; sku: string }[]
): Promise<ActionResult> {
  try {
    const user = await getAdminUser();
    if (!user) return { error: "Não autenticado" };

    const parsed = productSchema.safeParse(formData);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const data = parsed.data;

    const { error: prodErr } = await supabaseAdmin
      .from("products")
      .update({
        title: data.title,
        slug: data.slug,
        brand: data.brand || null,
        description: data.description || null,
        category_id: data.categoryId,
        status: data.status,
        base_price: data.basePrice,
        sale_price: data.salePrice ?? null,
        sku_root: data.skuRoot || null,
        seo_title: data.seoTitle || null,
        seo_description: data.seoDescription || null,
        gender: data.gender || null,
        badge: data.badge || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (prodErr) {
      return { error: prodErr.message };
    }

    // Replace images
    await supabaseAdmin.from("product_images").delete().eq("product_id", id);
    if (images.length > 0) {
      const { error: imgErr } = await supabaseAdmin
        .from("product_images")
        .insert(
          images.map((img) => ({
            product_id: id,
            url: img.url,
            alt: img.alt || null,
            position: img.position,
          }))
        );
      if (imgErr) return { error: `Erro nas imagens: ${imgErr.message}` };
    }

    // Replace variants
    await supabaseAdmin.from("product_variants").delete().eq("product_id", id);
    if (variants.length > 0) {
      const { error: varErr } = await supabaseAdmin
        .from("product_variants")
        .insert(
          variants.map((v) => ({
            product_id: id,
            sku: v.sku,
            size: v.size,
            color: v.color,
            stock: v.stock,
          }))
        );
      if (varErr) return { error: `Erro nas variantes: ${varErr.message}` };
    }

    await auditLog({
      userId: user.id,
      action: "update",
      entity: "products",
      entityId: id,
      diff: data,
    });

    revalidatePath("/admin/produtos");
    return { id };
  } catch (e) {
    console.error("[updateProduct] unexpected error", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado ao atualizar produto" };
  }
}

export async function duplicateProduct(id: string): Promise<ActionResult> {
  try {
    const user = await getAdminUser();
    if (!user) return { error: "Não autenticado" };

    // Fetch original product
    const { data: original, error: fetchErr } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !original) {
      return { error: "Produto não encontrado" };
    }

    // Create copy
    const { data: copy, error: copyErr } = await supabaseAdmin
      .from("products")
      .insert({
        title: `${original.title} (Cópia)`,
        slug: `${original.slug}-copy-${Date.now()}`,
        brand: original.brand,
        description: original.description,
        category_id: original.category_id,
        status: "draft",
        base_price: original.base_price,
        sale_price: original.sale_price,
        sku_root: original.sku_root ? `${original.sku_root}-COPY` : null,
        seo_title: original.seo_title,
        seo_description: original.seo_description,
        gender: original.gender,
        badge: original.badge,
      })
      .select("id")
      .single();

    if (copyErr || !copy) {
      return { error: copyErr?.message ?? "Erro ao duplicar produto" };
    }

    // Copy images
    const { data: images } = await supabaseAdmin
      .from("product_images")
      .select("url, alt, position")
      .eq("product_id", id);

    if (images && images.length > 0) {
      await supabaseAdmin.from("product_images").insert(
        images.map((img) => ({
          product_id: copy.id,
          url: img.url,
          alt: img.alt,
          position: img.position,
        }))
      );
    }

    // Copy variants
    const { data: origVariants } = await supabaseAdmin
      .from("product_variants")
      .select("size, color, stock, sku")
      .eq("product_id", id);

    if (origVariants && origVariants.length > 0) {
      await supabaseAdmin.from("product_variants").insert(
        origVariants.map((v) => ({
          product_id: copy.id,
          size: v.size,
          color: v.color,
          stock: v.stock,
          sku: `${v.sku}-COPY`,
        }))
      );
    }

    await auditLog({
      userId: user.id,
      action: "duplicate",
      entity: "products",
      entityId: id,
      diff: { newId: copy.id },
    });

    revalidatePath("/admin/produtos");
    return { id: copy.id };
  } catch (e) {
    console.error("[duplicateProduct] unexpected error", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado ao duplicar produto" };
  }
}

export async function bulkDeleteProducts(
  ids: string[]
): Promise<ActionResult & { deleted?: number }> {
  try {
    const user = await getAdminUser();
    if (!user) return { error: "Não autenticado" };
    if (!ids.length) return { deleted: 0 };

    await supabaseAdmin.from("product_images").delete().in("product_id", ids);
    await supabaseAdmin.from("product_variants").delete().in("product_id", ids);

    const { error, count } = await supabaseAdmin
      .from("products")
      .delete({ count: "exact" })
      .in("id", ids);

    if (error) return { error: error.message };

    await auditLog({
      userId: user.id,
      action: "bulk_delete",
      entity: "products",
      diff: { ids },
    });

    revalidatePath("/admin/produtos");
    revalidatePath("/");
    revalidatePath("/busca");
    return { deleted: count ?? ids.length };
  } catch (e) {
    console.error("[bulkDeleteProducts] unexpected error", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado ao excluir produtos" };
  }
}

export async function archiveProduct(id: string): Promise<ActionResult> {
  try {
    const user = await getAdminUser();
    if (!user) return { error: "Não autenticado" };

    // Hard delete: remove product + dependents
    await supabaseAdmin.from("product_images").delete().eq("product_id", id);
    await supabaseAdmin.from("product_variants").delete().eq("product_id", id);

    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

    if (error) {
      return { error: error.message };
    }

    await auditLog({
      userId: user.id,
      action: "delete",
      entity: "products",
      entityId: id,
    });

    revalidatePath("/admin/produtos");
    revalidatePath("/");
    revalidatePath("/busca");
    return {};
  } catch (e) {
    console.error("[archiveProduct] unexpected error", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado ao excluir produto" };
  }
}
