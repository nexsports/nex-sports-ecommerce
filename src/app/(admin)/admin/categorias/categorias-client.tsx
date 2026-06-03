"use client";

import { useState, useTransition } from "react";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import { createCategory, updateCategory, deleteCategory, updateCategoryPosition } from "./actions";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  position: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  productCount: number;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoriasClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    imageUrl: "",
    position: 0,
    seoTitle: "",
    seoDescription: "",
  });

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditing(null);
    setForm({ name: "", slug: "", imageUrl: "", position: categories.length, seoTitle: "", seoDescription: "" });
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      imageUrl: cat.image_url ?? "",
      position: cat.position,
      seoTitle: cat.seo_title ?? "",
      seoDescription: cat.seo_description ?? "",
    });
    setModalOpen(true);
  }

  function handleSubmit() {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("slug", form.slug || slugify(form.name));
    fd.append("imageUrl", form.imageUrl);
    fd.append("position", String(form.position));
    fd.append("seoTitle", form.seoTitle);
    fd.append("seoDescription", form.seoDescription);

    startTransition(async () => {
      try {
        if (editing) {
          await updateCategory(editing.id, fd);
          toast.success("Categoria atualizada");
        } else {
          await createCategory(fd);
          toast.success("Categoria criada");
        }
        setModalOpen(false);
        // Refresh data
        const res = await fetch("/admin/categorias", { next: { tags: ["categorias"] } });
        window.location.reload();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Erro ao salvar");
      }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteCategory(deleteTarget.id);
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
        toast.success("Categoria excluída");
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Erro ao excluir");
      }
    });
  }

  function handlePositionChange(id: string, value: string) {
    const pos = parseInt(value, 10);
    if (isNaN(pos)) return;
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, position: pos } : c)));
    startTransition(async () => {
      try {
        await updateCategoryPosition(id, pos);
      } catch (e: unknown) {
        toast.error("Erro ao atualizar posição");
      }
    });
  }

  const columns = [
    {
      key: "name",
      header: "Nome",
      render: (row: Category) => (
        <div className="flex items-center gap-3">
          {row.image_url ? (
            <img src={row.image_url} alt={row.name} className="h-8 w-8 rounded-lg object-cover" />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "position",
      header: "Posição",
      render: (row: Category) => (
        <Input
          type="number"
          value={row.position}
          onChange={(e) => handlePositionChange(row.id, e.target.value)}
          className="w-20 h-8 text-xs bg-secondary border-border"
          min={0}
        />
      ),
    },
    {
      key: "productCount",
      header: "# Produtos",
      render: (row: Category) => (
        <Badge variant="outline" className="text-xs bg-secondary">
          {row.productCount}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row: Category) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(row)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Categorias</h1>
      </div>

      <Card className="rounded-2xl border-border bg-card">
        <CardContent className="pt-6">
          <DataTable
            columns={columns as any}
            data={filtered as unknown as Record<string, unknown>[]}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar categorias..."
            actions={
              <Button onClick={openCreate} size="sm">
                <Plus className="h-4 w-4 mr-2" /> Nova Categoria
              </Button>
            }
            emptyMessage="Nenhuma categoria encontrada"
          />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name">Nome</Label>
                <Input
                  id="cat-name"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({ ...f, name, slug: editing ? f.slug : slugify(name) }));
                  }}
                  placeholder="Ex: Camisetas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-slug">Slug</Label>
                <Input
                  id="cat-slug"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="camisetas"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat-image">URL da Imagem</Label>
                <Input
                  id="cat-image"
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-pos">Posição</Label>
                <Input
                  id="cat-pos"
                  type="number"
                  value={form.position}
                  onChange={(e) => setForm((f) => ({ ...f, position: parseInt(e.target.value) || 0 }))}
                  min={0}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-seo-title">SEO Título</Label>
              <Input
                id="cat-seo-title"
                value={form.seoTitle}
                onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
                placeholder="Título para SEO"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-seo-desc">SEO Descrição</Label>
              <Input
                id="cat-seo-desc"
                value={form.seoDescription}
                onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
                placeholder="Descrição para SEO"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Salvando..." : editing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Excluir categoria"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Produtos vinculados perderão essa categoria.`}
        confirmLabel="Excluir"
        destructive
        onConfirm={handleDelete}
        loading={isPending}
      />
    </div>
  );
}
