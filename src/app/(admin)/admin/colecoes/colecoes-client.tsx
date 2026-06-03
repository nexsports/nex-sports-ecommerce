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
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Layers, Search, X } from "lucide-react";
import {
  createCollection,
  updateCollection,
  deleteCollection,
  addProductToCollection,
  removeProductFromCollection,
  searchProducts,
} from "./actions";
import { toast } from "sonner";

interface Collection {
  id: string;
  name: string;
  slug: string;
  type: "manual" | "rule";
  position: number;
  active: boolean;
  created_at: string;
  productCount: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ColecoesClient({ initialCollections }: { initialCollections: Collection[] }) {
  const [collections, setCollections] = useState(initialCollections);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);
  const [productsModalOpen, setProductsModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "manual" as "manual" | "rule",
    position: 0,
    active: true,
  });

  const filtered = collections.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditing(null);
    setForm({ name: "", slug: "", type: "manual", position: collections.length, active: true });
    setModalOpen(true);
  }

  function openEdit(col: Collection) {
    setEditing(col);
    setForm({
      name: col.name,
      slug: col.slug,
      type: col.type,
      position: col.position,
      active: col.active,
    });
    setModalOpen(true);
  }

  function openProducts(col: Collection) {
    setSelectedCollection(col);
    setProductsModalOpen(true);
    setProductSearch("");
    setSearchResults([]);
    // Load current products for this collection
    startTransition(async () => {
      try {
        const res = await fetch(`/admin/colecoes?collectionId=${col.id}`);
        // We'll use a server action approach instead
      } catch {}
    });
  }

  function handleSubmit() {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("slug", form.slug || slugify(form.name));
    fd.append("type", form.type);
    fd.append("position", String(form.position));
    fd.append("active", String(form.active));

    startTransition(async () => {
      try {
        if (editing) {
          await updateCollection(editing.id, fd);
          toast.success("Coleção atualizada");
        } else {
          await createCollection(fd);
          toast.success("Coleção criada");
        }
        setModalOpen(false);
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
        await deleteCollection(deleteTarget.id);
        setCollections((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
        toast.success("Coleção excluída");
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Erro ao excluir");
      }
    });
  }

  function handleProductSearch(query: string) {
    setProductSearch(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    startTransition(async () => {
      try {
        const results = await searchProducts(query);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      }
    });
  }

  function handleAddProduct(productId: string) {
    if (!selectedCollection) return;
    startTransition(async () => {
      try {
        await addProductToCollection(selectedCollection.id, productId);
        toast.success("Produto adicionado à coleção");
        setProductSearch("");
        setSearchResults([]);
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Erro ao adicionar produto");
      }
    });
  }

  function handleRemoveProduct(productId: string) {
    if (!selectedCollection) return;
    startTransition(async () => {
      try {
        await removeProductFromCollection(selectedCollection.id, productId);
        setCollectionProducts((prev) => prev.filter((p) => p.id !== productId));
        toast.success("Produto removido da coleção");
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Erro ao remover produto");
      }
    });
  }

  const columns = [
    {
      key: "name",
      header: "Nome",
      render: (row: Collection) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
            <Layers className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Tipo",
      render: (row: Collection) => (
        <Badge variant="outline" className="text-xs bg-secondary">
          {row.type === "manual" ? "Manual" : "Regra"}
        </Badge>
      ),
    },
    {
      key: "position",
      header: "Posição",
      render: (row: Collection) => <span className="text-sm">{row.position}</span>,
    },
    {
      key: "active",
      header: "Status",
      render: (row: Collection) => (
        <Badge
          variant="outline"
          className={`text-xs border-0 ${row.active ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}
        >
          {row.active ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      key: "productCount",
      header: "# Produtos",
      render: (row: Collection) => (
        <Badge variant="outline" className="text-xs bg-secondary">
          {row.productCount}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row: Collection) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => openProducts(row)}>
            Produtos
          </Button>
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
        <h1 className="text-2xl font-bold tracking-tight">Coleções</h1>
      </div>

      <Card className="rounded-2xl border-border bg-card">
        <CardContent className="pt-6">
          <DataTable
            columns={columns as any}
            data={filtered as unknown as Record<string, unknown>[]}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar coleções..."
            actions={
              <Button onClick={openCreate} size="sm">
                <Plus className="h-4 w-4 mr-2" /> Nova Coleção
              </Button>
            }
            emptyMessage="Nenhuma coleção encontrada"
          />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Coleção" : "Nova Coleção"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="col-name">Nome</Label>
                <Input
                  id="col-name"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({ ...f, name, slug: editing ? f.slug : slugify(name) }));
                  }}
                  placeholder="Ex: Lançamentos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="col-slug">Slug</Label>
                <Input
                  id="col-slug"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="lancamentos"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.type} onValueChange={(v: string) => setForm((f) => ({ ...f, type: v as "manual" | "rule" }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="rule">Regra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="col-pos">Posição</Label>
                <Input
                  id="col-pos"
                  type="number"
                  value={form.position}
                  onChange={(e) => setForm((f) => ({ ...f, position: parseInt(e.target.value) || 0 }))}
                  min={0}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.active}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, active: checked }))}
              />
              <Label>Ativo</Label>
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

      {/* Products Modal */}
      <Dialog open={productsModalOpen} onOpenChange={setProductsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Produtos — {selectedCollection?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produto para adicionar..."
                value={productSearch}
                onChange={(e) => handleProductSearch(e.target.value)}
                className="pl-9 bg-secondary border-border"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="rounded-xl border border-border divide-y divide-border max-h-48 overflow-y-auto">
                {searchResults.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">/{p.slug}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleAddProduct(p.id)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {collectionProducts.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Produtos na coleção</Label>
                <div className="rounded-xl border border-border divide-y divide-border">
                  {collectionProducts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between px-3 py-2">
                      <p className="text-sm">{p.name}</p>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleRemoveProduct(p.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Excluir coleção"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`}
        confirmLabel="Excluir"
        destructive
        onConfirm={handleDelete}
        loading={isPending}
      />
    </div>
  );
}
