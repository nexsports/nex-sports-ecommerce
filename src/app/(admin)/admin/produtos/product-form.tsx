"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductImageUploader } from "@/components/admin/product-image-uploader";
import {
  createProduct,
  updateProduct,
  type ProductFormValues,
} from "./_actions";

interface Category {
  id: string;
  name: string;
}

interface ImageItem {
  id?: string;
  url: string;
  alt?: string;
  position: number;
}

interface Variant {
  id?: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
}

interface ProductFormProps {
  mode: "create" | "edit";
  categories: Category[];
  initialData?: ProductFormValues & {
    images: ImageItem[];
    variants: Variant[];
  };
  productId?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({ mode, categories, initialData, productId }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form state
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [brand, setBrand] = useState(initialData?.brand ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [status, setStatus] = useState<"draft" | "active" | "archived">(
    initialData?.status ?? "draft"
  );
  const [gender, setGender] = useState<string>(initialData?.gender ?? "");
  const [badge, setBadge] = useState<string>(initialData?.badge ?? "");
  const [basePrice, setBasePrice] = useState(
    initialData?.basePrice ? (initialData.basePrice / 100).toFixed(2) : ""
  );
  const [salePrice, setSalePrice] = useState(
    initialData?.salePrice ? (initialData.salePrice / 100).toFixed(2) : ""
  );
  const [skuRoot, setSkuRoot] = useState(initialData?.skuRoot ?? "");
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription ?? "");

  // Images & variants
  const [images, setImages] = useState<ImageItem[]>(initialData?.images ?? []);
  const [variants, setVariants] = useState<Variant[]>(initialData?.variants ?? []);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugEdited && title) {
      setSlug(slugify(title));
    }
  }, [title, slugEdited]);

  function parseCents(value: string): number {
    const cleaned = value.replace(/[^\d,]/g, "").replace(",", ".");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : Math.round(num * 100);
  }

  function generateVariants() {
    const sizes = ["P", "M", "G", "GG"];
    const colors = ["Preto", "Branco"];
    const newVariants: Variant[] = [];
    for (const size of sizes) {
      for (const color of colors) {
        const existing = variants.find((v) => v.size === size && v.color === color);
        if (existing) {
          newVariants.push(existing);
        } else {
          const sku = skuRoot ? `${skuRoot}-${size}-${color.slice(0, 3).toUpperCase()}` : "";
          newVariants.push({ size, color, stock: 0, sku });
        }
      }
    }
    setVariants(newVariants);
  }

  function handleSubmit() {
    const formValues: ProductFormValues = {
      title,
      slug,
      brand: brand || "",
      description: description || "",
      categoryId,
      status,
      gender: gender || "",
      badge: badge || "",
      basePrice: parseCents(basePrice),
      salePrice: salePrice ? parseCents(salePrice) : null,
      skuRoot: skuRoot || "",
      seoTitle: seoTitle || "",
      seoDescription: seoDescription || "",
    };

    if (!formValues.title) {
      toast.error("Título obrigatório");
      return;
    }
    if (!formValues.slug) {
      toast.error("Slug obrigatório");
      return;
    }
    if (!formValues.categoryId) {
      toast.error("Selecione uma categoria");
      return;
    }
    if (formValues.basePrice <= 0) {
      toast.error("Preço deve ser maior que zero");
      return;
    }

    const normalizedImages = images.map((img) => ({
      ...img,
      alt: img.alt ?? "",
    }));

    startTransition(async () => {
      try {
        let result;
        if (mode === "create") {
          result = await createProduct(formValues, normalizedImages, variants);
        } else {
          result = await updateProduct(productId!, formValues, normalizedImages, variants);
        }

        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(
            mode === "create" ? "Produto criado com sucesso" : "Produto atualizado"
          );
          router.push("/admin/produtos");
          router.refresh();
        }
      } catch {
        toast.error("Erro inesperado");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <a href="/admin/produtos">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "create" ? "Novo produto" : "Editar produto"}
          </h1>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Save className="h-4 w-4 mr-2" />
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <Tabs defaultValue="basico" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basico">Básico</TabsTrigger>
          <TabsTrigger value="midia">Mídia</TabsTrigger>
          <TabsTrigger value="preco">Preço</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Básico */}
        <TabsContent value="basico">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Informações básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nome do produto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugEdited(true);
                    }}
                    placeholder="slug-do-produto"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Nike, Adidas..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição do produto..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gênero</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unissex">Unissex</SelectItem>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Badge</Label>
                  <Select value={badge} onValueChange={setBadge}>
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      <SelectItem value="HOT">HOT</SelectItem>
                      <SelectItem value="NOVO">NOVO</SelectItem>
                      <SelectItem value="TOP 1">TOP 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mídia */}
        <TabsContent value="midia">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Imagens do produto</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductImageUploader images={images} onChange={setImages} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preço */}
        <TabsContent value="preco">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Preços</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Preço base (R$)</Label>
                  <Input
                    id="basePrice"
                    type="text"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Preço promocional (R$)</Label>
                  <Input
                    id="salePrice"
                    type="text"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="Deixe vazio se não houver"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skuRoot">SKU raiz</Label>
                  <Input
                    id="skuRoot"
                    value={skuRoot}
                    onChange={(e) => setSkuRoot(e.target.value)}
                    placeholder="NEX-001"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Estoque */}
        <TabsContent value="estoque">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Variantes</CardTitle>
              <Button variant="outline" size="sm" onClick={generateVariants}>
                Gerar variantes (P/M/G/GG)
              </Button>
            </CardHeader>
            <CardContent>
              {variants.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Nenhuma variante. Clique em &quot;Gerar variantes&quot; ou adicione manualmente.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                          Tamanho
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                          Cor
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                          SKU
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                          Estoque
                        </th>
                        <th className="px-3 py-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((v, i) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="px-3 py-2">
                            <Input
                              value={v.size}
                              onChange={(e) => {
                                const next = [...variants];
                                next[i] = { ...v, size: e.target.value };
                                setVariants(next);
                              }}
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={v.color}
                              onChange={(e) => {
                                const next = [...variants];
                                next[i] = { ...v, color: e.target.value };
                                setVariants(next);
                              }}
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={v.sku}
                              onChange={(e) => {
                                const next = [...variants];
                                next[i] = { ...v, sku: e.target.value };
                                setVariants(next);
                              }}
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              min={0}
                              value={v.stock}
                              onChange={(e) => {
                                const next = [...variants];
                                next[i] = { ...v, stock: parseInt(e.target.value) || 0 };
                                setVariants(next);
                              }}
                              className="h-8 w-20 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => setVariants(variants.filter((_, j) => j !== i))}
                            >
                              &times;
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() =>
                  setVariants([
                    ...variants,
                    { size: "", color: "", stock: 0, sku: "" },
                  ])
                }
              >
                + Adicionar variante
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium">SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">Título SEO</Label>
                <Input
                  id="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Título para mecanismos de busca"
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {seoTitle.length}/200 caracteres
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">Descrição SEO</Label>
                <Textarea
                  id="seoDescription"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Descrição para mecanismos de busca"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
