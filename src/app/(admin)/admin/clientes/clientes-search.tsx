"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ClientesSearch({ searchQ }: { searchQ?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");
    router.push(`/admin/clientes?${params.toString()}`);
  }

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar por nome ou email..."
        defaultValue={searchQ}
        onChange={(e) => {
          const val = e.target.value;
          const timeout = setTimeout(() => update(val), 300);
          return () => clearTimeout(timeout);
        }}
        className="pl-9 bg-secondary border-border"
      />
    </div>
  );
}
