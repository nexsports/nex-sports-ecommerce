import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { assertAdmin, jsonOk, jsonErr } from "@/lib/api/admin-auth";

const ALLOWED_BUCKETS = ["products", "categories", "partners", "banners"] as const;
const MAX_SIZES: Record<string, number> = {
  products: 5 * 1024 * 1024,
  categories: 5 * 1024 * 1024,
  partners: 2 * 1024 * 1024,
  banners: 10 * 1024 * 1024,
};

export async function POST(req: Request) {
  await assertAdmin();

  const formData = await req.formData();
  const file = formData.get("file");
  const bucket = formData.get("bucket") as string | null;

  if (!file || !(file instanceof File)) {
    return jsonErr("Arquivo obrigatório (campo 'file')");
  }

  if (!bucket || !ALLOWED_BUCKETS.includes(bucket as typeof ALLOWED_BUCKETS[number])) {
    return jsonErr(`Bucket inválido. Use: ${ALLOWED_BUCKETS.join(", ")}`);
  }

  const maxSize = MAX_SIZES[bucket];
  if (file.size > maxSize) {
    return jsonErr(`Arquivo excede o limite de ${Math.round(maxSize / 1024 / 1024)}MB`);
  }

  // Validate MIME type
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
  if (!allowedMimes.includes(file.type)) {
    return jsonErr("Tipo de arquivo não permitido. Use: JPEG, PNG, WebP, AVIF ou GIF");
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `${bucket}/${uniqueName}`;

  const arrayBuffer = await file.arrayBuffer();

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) return jsonErr(error.message, 500);

  const { data: urlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return jsonOk({
    url: urlData.publicUrl,
    path: data.path,
    bucket,
    size: file.size,
    mimeType: file.type,
  }, 201);
}
