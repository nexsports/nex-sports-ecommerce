"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProduct, updateProduct, type ProductFormValues } from "./_actions";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  mode: "create" | "edit";
  categories: Category[];
  initialData?: ProductFormValues & { id?: string };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({ mode, categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [brand, setBrand] = useState(initialData?.brand ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [status, setStatus] = useState<"draft" | "active" | "archived">(
    initialData?.status ?? "active"
  );
  const [basePrice, setBasePrice] = useState(
    initialData?.basePriceCents ? (initialData.basePriceCents / 100).toFixed(2) : ""
  );
  const [salePrice, setSalePrice] = useState(
    initialData?.salePriceCents ? (initialData.salePriceCents / 100).toFixed(2) : ""
  );
  const [stock, setStock] = useState(String(initialData?.stock ?? 0));
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugEdited) setSlug(slugify(v));
  }

  function parseCents(v: string): number {
    const n = parseFloat(v.replace(/[^\d,.]/g, "").replace(",", "."));
    return isNaN(n) ? 0 : Math.round(n * 100);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "products");
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error ?? "Falha no upload");
      }
      const j = await r.json();
      setImageUrl(j.url);
      toast.success("Imagem enviada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const values: ProductFormValues = {
      title,
      slug,
      brand: brand || null,
      description: description || null,
      categoryId,
      status,
      basePriceCents: parseCents(basePrice),
      salePriceCents: salePrice ? parseCents(salePrice) : null,
      imageUrl: imageUrl || null,
      stock: parseInt(stock, 10) || 0,
    };
    if (!values.title) {
      toast.error("Título obrigatório");
      return;
    }
    if (!values.categoryId) {
      toast.error("Selecione categoria");
      return;
    }
    if (values.basePriceCents <= 0) {
      toast.error("Preço deve ser positivo");
      return;
    }

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createProduct(values)
          : await updateProduct(initialData!.id!, values);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(mode === "create" ? "Produto criado" : "Produto atualizado");
      window.location.href = "/admin/produtos";
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/produtos")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {mode === "create" ? "Novo produto" : "Editar produto"}
          </h1>
        </div>
        <Button type="submit" disabled={pending}>
          <Save className="h-4 w-4 mr-2" />
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="Camisa Pro Match Elite"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugEdited(true);
                  }}
                  placeholder="camisa-pro-match"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Marca</Label>
                  <Input
                    value={brand ?? ""}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Nike"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estoque</Label>
                  <Input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  rows={5}
                  value={description ?? ""}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) =>
                    setStatus(v as "draft" | "active" | "archived")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preço (R$) *</Label>
                <Input
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="99,00"
                />
              </div>
              <div className="space-y-2">
                <Label>Preço promo (R$)</Label>
                <Input
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="79,90"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <Label>Imagem</Label>
              {imageUrl ? (
                <div className="relative aspect-square rounded-lg overflow-hidden border border-border">
                  <Image src={imageUrl} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-border cursor-pointer hover:bg-secondary/30">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">
                    {uploading ? "Enviando..." : "Clique pra enviar"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
