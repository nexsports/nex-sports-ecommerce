"use client";

import { useState, useTransition } from "react";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldOff, UserCog } from "lucide-react";
import { updateUserRole } from "./actions";
import { toast } from "sonner";

interface StaffUser {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "staff";
  created_at: string;
}

const roleConfig: Record<string, { label: string; className: string }> = {
  admin: { label: "Admin", className: "bg-primary/20 text-primary" },
  staff: { label: "Staff", className: "bg-accent/20 text-accent" },
};

export function UsuariosClient({ initialUsers }: { initialUsers: StaffUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleTarget, setRoleTarget] = useState<{ user: StaffUser; newRole: "admin" | "staff" } | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = users.filter(
    (u) =>
      (u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleRoleChange() {
    if (!roleTarget) return;
    startTransition(async () => {
      try {
        await updateUserRole(roleTarget.user.id, roleTarget.newRole);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === roleTarget.user.id ? { ...u, role: roleTarget.newRole } : u
          )
        );
        setRoleTarget(null);
        toast.success(`Usuário ${roleTarget.newRole === "admin" ? "promovido a admin" : "rebaixado para staff"}`);
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Erro ao alterar role");
      }
    });
  }

  const columns = [
    {
      key: "name",
      header: "Nome",
      render: (row: StaffUser) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{row.name ?? "Sem nome"}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (row: StaffUser) => {
        const config = roleConfig[row.role] ?? roleConfig.staff;
        return (
          <Badge variant="outline" className={`text-xs border-0 ${config.className}`}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "created_at",
      header: "Criado em",
      render: (row: StaffUser) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.created_at).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row: StaffUser) => (
        <div className="flex items-center justify-end gap-1">
          {row.role === "staff" ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-primary"
              onClick={() => setRoleTarget({ user: row, newRole: "admin" })}
            >
              <Shield className="h-3.5 w-3.5 mr-1" />
              Promover a Admin
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground"
              onClick={() => setRoleTarget({ user: row, newRole: "staff" })}
            >
              <ShieldOff className="h-3.5 w-3.5 mr-1" />
              Rebaixar para Staff
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
      </div>

      <Card className="rounded-2xl border-border bg-card">
        <CardContent className="pt-6">
          <DataTable
            columns={columns as any}
            data={filtered as unknown as Record<string, unknown>[]}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar usuários..."
            emptyMessage="Nenhum usuário staff/admin encontrado"
          />
        </CardContent>
      </Card>

      {/* Role Change Confirm */}
      <ConfirmDialog
        open={!!roleTarget}
        onOpenChange={() => setRoleTarget(null)}
        title={roleTarget?.newRole === "admin" ? "Promover a Admin" : "Rebaixar para Staff"}
        description={
          roleTarget
            ? `Tem certeza que deseja ${roleTarget.newRole === "admin" ? "promover" : "rebaixar"} ${roleTarget.user.name ?? roleTarget.user.email} ${roleTarget.newRole === "admin" ? "a administrador" : "para staff"}?`
            : ""
        }
        confirmLabel={roleTarget?.newRole === "admin" ? "Promover" : "Rebaixar"}
        destructive={roleTarget?.newRole === "staff"}
        onConfirm={handleRoleChange}
        loading={isPending}
      />
    </div>
  );
}
