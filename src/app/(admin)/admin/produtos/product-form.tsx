"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload, X, Plus, ChevronUp, ChevronDown } from "lucide-react";
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
  const [gender, setGender] = useState<"masculino" | "feminino" | "unissex">(
    initialData?.gender ?? "unissex"
  );
  const [basePrice, setBasePrice] = useState(
    initialData?.basePriceCents ? (initialData.basePriceCents / 100).toFixed(2) : ""
  );
  const [salePrice, setSalePrice] = useState(
    initialData?.salePriceCents ? (initialData.salePriceCents / 100).toFixed(2) : ""
  );
  const [stock, setStock] = useState(String(initialData?.stock ?? 0));

  // Images
  const [images, setImages] = useState<{ url: string; alt?: string | null }[]>(
    initialData?.images ?? (initialData?.imageUrl ? [{ url: initialData.imageUrl, alt: "" }] : [])
  );

  // Attributes
  const [attributes, setAttributes] = useState<{ name: string; value: string }[]>(
    initialData?.attributes ?? []
  );

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugEdited) setSlug(slugify(v));
  }

  function parseCents(v: string): number {
    const n = parseFloat(v.replace(/[^\d,.]/g, "").replace(",", "."));
    return isNaN(n) ? 0 : Math.round(n * 100);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fd = new FormData();
        fd.append("file", file);
        fd.append("bucket", "products");
        const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j.error ?? "Falha no upload");
        }
        const j = await r.json();
        setImages((prev) => [...prev, { url: j.url, alt: "" }]);
      }
      toast.success(
        files.length === 1 ? "Imagem enviada" : `${files.length} imagens enviadas`
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function moveImage(idx: number, dir: -1 | 1) {
    const next = [...images];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setImages(next);
  }

  function updateAttr(idx: number, field: "name" | "value", val: string) {
    const next = [...attributes];
    next[idx] = { ...next[idx], [field]: val };
    setAttributes(next);
  }

  function removeAttr(idx: number) {
    setAttributes((prev) => prev.filter((_, i) => i !== idx));
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
      gender,
      basePriceCents: parseCents(basePrice),
      salePriceCents: salePrice ? parseCents(salePrice) : null,
      stock: parseInt(stock, 10) || 0,
      images: images.filter((i) => i.url),
      attributes: attributes.filter((a) => a.name && a.value),
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
          {/* Basic info */}
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

          {/* Specifications */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <Label>Especificações</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setAttributes([...attributes, { name: "", value: "" }])
                  }
                >
                  <Plus className="h-3 w-3 mr-1" /> Adicionar
                </Button>
              </div>
              {attributes.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Ex: Material, Composição, Peso, Dimensões...
                </p>
              )}
              {attributes.map((a, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    className="flex-1"
                    placeholder="Nome (ex: Material)"
                    value={a.name}
                    onChange={(e) => updateAttr(i, "name", e.target.value)}
                  />
                  <Input
                    className="flex-1"
                    placeholder="Valor"
                    value={a.value}
                    onChange={(e) => updateAttr(i, "value", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAttr(i)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Category, status, gender, pricing */}
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
                <Label>Gênero</Label>
                <Select
                  value={gender}
                  onValueChange={(v) =>
                    setGender(v as "masculino" | "feminino" | "unissex")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unissex">Unissex</SelectItem>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
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

          {/* Images */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Label>Imagens</Label>
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative group rounded-lg overflow-hidden border border-border"
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={img.url}
                          alt={img.alt ?? ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => moveImage(i, -1)}
                          disabled={i === 0}
                          className="h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center disabled:opacity-30"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(i, 1)}
                          disabled={i === images.length - 1}
                          className="h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center disabled:opacity-30"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {i === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 text-[10px] font-medium bg-black/60 text-white px-1.5 py-0.5 rounded">
                          Principal
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <label className="flex items-center justify-center gap-2 h-10 rounded-lg border-2 border-dashed border-border cursor-pointer hover:bg-secondary/30 transition-colors">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {uploading
                    ? "Enviando..."
                    : images.length > 0
                      ? "Adicionar mais"
                      : "Adicionar imagem"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
