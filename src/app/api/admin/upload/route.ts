import { supabaseAdmin } from "@/lib/supabase/admin-client";
import { assertAdminFromRequest, jsonErr } from "@/lib/api/admin-auth";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const ALLOWED_BUCKETS = ["products", "categories", "partners", "banners"] as const;
const MAX_SIZES: Record<string, number> = {
  products: 5 * 1024 * 1024,
  categories: 5 * 1024 * 1024,
  partners: 2 * 1024 * 1024,
  banners: 10 * 1024 * 1024,
};
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

export async function POST(req: Request) {
  try {
    await assertAdminFromRequest(req);

    const formData = await req.formData();
    const file = formData.get("file");
    const bucket = formData.get("bucket") as string | null;

    if (!file || !(file instanceof File)) {
      return jsonErr("Arquivo obrigatório (campo 'file')");
    }

    if (!bucket || !ALLOWED_BUCKETS.includes(bucket as (typeof ALLOWED_BUCKETS)[number])) {
      return jsonErr(`Bucket inválido. Use: ${ALLOWED_BUCKETS.join(", ")}`);
    }

    const maxSize = MAX_SIZES[bucket];
    if (file.size > maxSize) {
      return jsonErr(`Arquivo excede o limite de ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    if (!ALLOWED_MIMES.includes(file.type)) {
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

    return Response.json(
      {
        url: urlData.publicUrl,
        path: data.path,
        bucket,
        size: file.size,
        mimeType: file.type,
      },
      { status: 201 },
    );
  } catch (e: unknown) {
    if (e instanceof Response) return e;
    return jsonErr((e as Error)?.message ?? "Upload failed", 500);
  }
}
