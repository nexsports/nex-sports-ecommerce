"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Store, Share2, Save } from "lucide-react";
import { saveSettings } from "./actions";
import { toast } from "sonner";

interface SettingsForm {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeCnpj: string;
  socialInstagram: string;
  socialTiktok: string;
}

export function ConfiguracoesClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<SettingsForm>({
    storeName: initialSettings["store.name"] ?? "",
    storeEmail: initialSettings["store.email"] ?? "",
    storePhone: initialSettings["store.phone"] ?? "",
    storeAddress: initialSettings["store.address"] ?? "",
    storeCnpj: initialSettings["store.cnpj"] ?? "",
    socialInstagram: initialSettings["social.instagram"] ?? "",
    socialTiktok: initialSettings["social.tiktok"] ?? "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("store.name", form.storeName);
    fd.append("store.email", form.storeEmail);
    fd.append("store.phone", form.storePhone);
    fd.append("store.address", form.storeAddress);
    fd.append("store.cnpj", form.storeCnpj);
    fd.append("social.instagram", form.socialInstagram);
    fd.append("social.tiktok", form.socialTiktok);

    startTransition(async () => {
      try {
        await saveSettings(fd);
        toast.success("Configurações salvas");
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Erro ao salvar");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Loja */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="h-5 w-5" />
              Loja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Nome da loja</Label>
                <Input
                  id="store-name"
                  value={form.storeName}
                  onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))}
                  placeholder="NEX Sports"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-email">E-mail</Label>
                <Input
                  id="store-email"
                  type="email"
                  value={form.storeEmail}
                  onChange={(e) => setForm((f) => ({ ...f, storeEmail: e.target.value }))}
                  placeholder="contato@nexsports.com.br"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store-phone">Telefone</Label>
                <Input
                  id="store-phone"
                  value={form.storePhone}
                  onChange={(e) => setForm((f) => ({ ...f, storePhone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-cnpj">CNPJ</Label>
                <Input
                  id="store-cnpj"
                  value={form.storeCnpj}
                  onChange={(e) => setForm((f) => ({ ...f, storeCnpj: e.target.value }))}
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-address">Endereço</Label>
              <Input
                id="store-address"
                value={form.storeAddress}
                onChange={(e) => setForm((f) => ({ ...f, storeAddress: e.target.value }))}
                placeholder="Rua Exemplo, 123 - São Paulo, SP"
              />
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociais */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Share2 className="h-5 w-5" />
              Redes Sociais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="social-ig">Instagram</Label>
                <Input
                  id="social-ig"
                  value={form.socialInstagram}
                  onChange={(e) => setForm((f) => ({ ...f, socialInstagram: e.target.value }))}
                  placeholder="https://instagram.com/nexsports"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-tt">TikTok</Label>
                <Input
                  id="social-tt"
                  value={form.socialTiktok}
                  onChange={(e) => setForm((f) => ({ ...f, socialTiktok: e.target.value }))}
                  placeholder="https://tiktok.com/@nexsports"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            <Save className="h-4 w-4 mr-2" />
            {isPending ? "Salvando..." : "Salvar configurações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
