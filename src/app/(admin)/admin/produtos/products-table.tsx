"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Copy, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatBRL } from "@/lib/utils/format";
import { duplicateProduct, archiveProduct } from "./_actions";
import { toast } from "sonner";

interface ProductRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  basePrice: number;
  brand: string | null;
  categoryName: string | null;
  thumbUrl: string | null;
  totalStock: number;
}

interface Category {
  id: string;
  name: string;
}

interface ProductsTableProps {
  products: ProductRow[];
  categories: Category[];
}

export function ProductsTable({ products, categories }: ProductsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmAction, setConfirmAction] = useState<{
    type: "duplicate" | "delete";
    id: string;
    title: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "all" || p.categoryName === catFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, search, catFilter, statusFilter]);

  async function handleConfirm() {
    if (!confirmAction) return;
    setLoading(true);

    try {
      if (confirmAction.type === "duplicate") {
        const res = await duplicateProduct(confirmAction.id);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Produto duplicado");
          window.location.reload();
        }
      } else {
        const res = await archiveProduct(confirmAction.id);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Produto excluído");
          window.location.reload();
        }
      }
    } catch {
      toast.error("Erro inesperado");
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  }

  const columns = [
    {
      key: "thumb",
      header: "",
      className: "w-12",
      render: (row: ProductRow) =>
        row.thumbUrl ? (
          <Image
            src={row.thumbUrl}
            alt={row.title}
            width={40}
            height={40}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
        ),
    },
    {
      key: "title",
      header: "Produto",
      render: (row: ProductRow) => (
        <div>
          <p className="font-medium text-foreground">{row.title}</p>
          {row.brand && <p className="text-xs text-muted-foreground">{row.brand}</p>}
        </div>
      ),
    },
    {
      key: "categoryName",
      header: "Categoria",
      render: (row: ProductRow) => row.categoryName ?? "—",
    },
    {
      key: "basePrice",
      header: "Preço",
      render: (row: ProductRow) => formatBRL(row.basePrice),
    },
    {
      key: "totalStock",
      header: "Estoque",
      render: (row: ProductRow) => (
        <span className={row.totalStock <= 0 ? "text-destructive" : ""}>
          {row.totalStock}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: ProductRow) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-28",
      render: (row: ProductRow) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href={`/admin/produtos/${row.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmAction({ type: "duplicate", id: row.id, title: row.title });
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmAction({ type: "delete", id: row.id, title: row.title });
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns as never}
        data={filtered as unknown as Record<string, unknown>[]}
        searchPlaceholder="Buscar produto..."
        searchValue={search}
        onSearchChange={setSearch}
        emptyMessage="Nenhum produto encontrado"
        filters={
          <div className="flex gap-2">
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger className="w-[160px] bg-secondary border-border">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-secondary border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        actions={
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/admin/produtos/novo">
              <Plus className="h-4 w-4 mr-2" />
              Novo
            </Link>
          </Button>
        }
      />

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={
          confirmAction?.type === "duplicate"
            ? "Duplicar produto"
            : "Excluir produto"
        }
        description={
          confirmAction?.type === "duplicate"
            ? `Deseja criar uma cópia de "${confirmAction?.title}"?`
            : `Excluir "${confirmAction?.title}" permanentemente? Esta ação não pode ser desfeita.`
        }
        confirmLabel={confirmAction?.type === "duplicate" ? "Duplicar" : "Excluir"}
        destructive={confirmAction?.type === "delete"}
        onConfirm={handleConfirm}
        loading={loading}
      />
    </>
  );
}
