"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Store, Share2, Save, Truck, CreditCard, QrCode, Mail, Search,
} from "lucide-react";
import { saveSettings } from "./actions";
import { toast } from "sonner";

interface SettingsForm {
  // Loja
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeCnpj: string;
  storeDescription: string;
  // Social
  socialInstagram: string;
  socialTiktok: string;
  socialWhatsapp: string;
  // Frete
  shippingFreeThreshold: string;
  shippingDefaultRate: string;
  // Pagamento
  paymentMpPublicKey: string;
  paymentMpAccessToken: string;
  // Pix
  pixBannerTitle: string;
  pixBannerBody: string;
  pixBannerCta: string;
  // Newsletter
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterCta: string;
  // SEO
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  seoOgImage: string;
}

export function ConfiguracoesClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<SettingsForm>({
    storeName: initialSettings["store.name"] ?? "",
    storeEmail: initialSettings["store.email"] ?? "",
    storePhone: initialSettings["store.phone"] ?? "",
    storeAddress: initialSettings["store.address"] ?? "",
    storeCnpj: initialSettings["store.cnpj"] ?? "",
    storeDescription: initialSettings["store.description"] ?? "",
    socialInstagram: initialSettings["social.instagram"] ?? "",
    socialTiktok: initialSettings["social.tiktok"] ?? "",
    socialWhatsapp: initialSettings["social.whatsapp"] ?? "",
    shippingFreeThreshold: initialSettings["shipping.free_threshold"] ?? "19900",
    shippingDefaultRate: initialSettings["shipping.default_rate"] ?? "1990",
    paymentMpPublicKey: initialSettings["payment.mp_public_key"] ?? "",
    paymentMpAccessToken: initialSettings["payment.mp_access_token"] ?? "",
    pixBannerTitle: initialSettings["pix.banner_title"] ?? "Pague com PIX",
    pixBannerBody: initialSettings["pix.banner_body"] ?? "Aprovação instantânea, sem taxas extras.",
    pixBannerCta: initialSettings["pix.banner_cta"] ?? "Saiba mais",
    newsletterTitle: initialSettings["newsletter.title"] ?? "Fique por dentro",
    newsletterSubtitle: initialSettings["newsletter.subtitle"] ?? "Reba ofertas exclusivas e novidades direto no seu e-mail.",
    newsletterCta: initialSettings["newsletter.cta"] ?? "Cadastrar",
    seoDefaultTitle: initialSettings["seo.default_title"] ?? "NEX Sports — Moda Esportiva",
    seoDefaultDescription: initialSettings["seo.default_description"] ?? "Roupas e acessórios esportivos de alta performance.",
    seoOgImage: initialSettings["seo.og_image"] ?? "",
  });

  const set = <K extends keyof SettingsForm>(key: K, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    const entries: [string, string][] = [
      ["store.name", form.storeName],
      ["store.email", form.storeEmail],
      ["store.phone", form.storePhone],
      ["store.address", form.storeAddress],
      ["store.cnpj", form.storeCnpj],
      ["store.description", form.storeDescription],
      ["social.instagram", form.socialInstagram],
      ["social.tiktok", form.socialTiktok],
      ["social.whatsapp", form.socialWhatsapp],
      ["shipping.free_threshold", form.shippingFreeThreshold],
      ["shipping.default_rate", form.shippingDefaultRate],
      ["payment.mp_public_key", form.paymentMpPublicKey],
      ["payment.mp_access_token", form.paymentMpAccessToken],
      ["pix.banner_title", form.pixBannerTitle],
      ["pix.banner_body", form.pixBannerBody],
      ["pix.banner_cta", form.pixBannerCta],
      ["newsletter.title", form.newsletterTitle],
      ["newsletter.subtitle", form.newsletterSubtitle],
      ["newsletter.cta", form.newsletterCta],
      ["seo.default_title", form.seoDefaultTitle],
      ["seo.default_description", form.seoDefaultDescription],
      ["seo.og_image", form.seoOgImage],
    ];
    for (const [k, v] of entries) fd.append(k, v);

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
                <Input id="store-name" value={form.storeName} onChange={(e) => set("storeName", e.target.value)} placeholder="NEX Sports" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-email">E-mail</Label>
                <Input id="store-email" type="email" value={form.storeEmail} onChange={(e) => set("storeEmail", e.target.value)} placeholder="contato@nexsports.com.br" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store-phone">Telefone</Label>
                <Input id="store-phone" value={form.storePhone} onChange={(e) => set("storePhone", e.target.value)} placeholder="(11) 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-cnpj">CNPJ</Label>
                <Input id="store-cnpj" value={form.storeCnpj} onChange={(e) => set("storeCnpj", e.target.value)} placeholder="00.000.000/0000-00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-address">Endereço</Label>
              <Input id="store-address" value={form.storeAddress} onChange={(e) => set("storeAddress", e.target.value)} placeholder="Rua Exemplo, 123 - São Paulo, SP" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-desc">Descrição da loja</Label>
              <Textarea id="store-desc" value={form.storeDescription} onChange={(e) => set("storeDescription", e.target.value)} placeholder="Moda esportiva de alta performance..." rows={3} />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="social-ig">Instagram</Label>
                <Input id="social-ig" value={form.socialInstagram} onChange={(e) => set("socialInstagram", e.target.value)} placeholder="https://instagram.com/nexsports" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-tt">TikTok</Label>
                <Input id="social-tt" value={form.socialTiktok} onChange={(e) => set("socialTiktok", e.target.value)} placeholder="https://tiktok.com/@nexsports" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-wa">WhatsApp</Label>
                <Input id="social-wa" value={form.socialWhatsapp} onChange={(e) => set("socialWhatsapp", e.target.value)} placeholder="5511999999999" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Frete */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck className="h-5 w-5" />
              Frete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ship-free">Frete grátis acima de (centavos)</Label>
                <Input id="ship-free" type="number" value={form.shippingFreeThreshold} onChange={(e) => set("shippingFreeThreshold", e.target.value)} placeholder="19900" />
                <p className="text-xs text-muted-foreground">19900 = R$199,00</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ship-rate">Taxa padrão (centavos)</Label>
                <Input id="ship-rate" type="number" value={form.shippingDefaultRate} onChange={(e) => set("shippingDefaultRate", e.target.value)} placeholder="1990" />
                <p className="text-xs text-muted-foreground">1990 = R$19,90</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pagamento */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-5 w-5" />
              Pagamento (Mercado Pago)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mp-pub">Public Key</Label>
                <Input id="mp-pub" value={form.paymentMpPublicKey} onChange={(e) => set("paymentMpPublicKey", e.target.value)} placeholder="APP_USR-..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mp-token">Access Token</Label>
                <Input id="mp-token" type="password" value={form.paymentMpAccessToken} onChange={(e) => set("paymentMpAccessToken", e.target.value)} placeholder="APP_USR-..." />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PIX Banner */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <QrCode className="h-5 w-5" />
              Banner PIX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pix-title">Título</Label>
                <Input id="pix-title" value={form.pixBannerTitle} onChange={(e) => set("pixBannerTitle", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pix-cta">CTA</Label>
                <Input id="pix-cta" value={form.pixBannerCta} onChange={(e) => set("pixBannerCta", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pix-body">Texto</Label>
              <Textarea id="pix-body" value={form.pixBannerBody} onChange={(e) => set("pixBannerBody", e.target.value)} rows={2} />
            </div>
          </CardContent>
        </Card>

        {/* Newsletter */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-5 w-5" />
              Newsletter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nl-title">Título</Label>
                <Input id="nl-title" value={form.newsletterTitle} onChange={(e) => set("newsletterTitle", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nl-cta">CTA</Label>
                <Input id="nl-cta" value={form.newsletterCta} onChange={(e) => set("newsletterCta", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nl-sub">Subtítulo</Label>
              <Textarea id="nl-sub" value={form.newsletterSubtitle} onChange={(e) => set("newsletterSubtitle", e.target.value)} rows={2} />
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-5 w-5" />
              SEO Padrão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seo-title">Título padrão</Label>
              <Input id="seo-title" value={form.seoDefaultTitle} onChange={(e) => set("seoDefaultTitle", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo-desc">Descrição padrão</Label>
              <Textarea id="seo-desc" value={form.seoDefaultDescription} onChange={(e) => set("seoDefaultDescription", e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo-og">OG Image URL</Label>
              <Input id="seo-og" value={form.seoOgImage} onChange={(e) => set("seoOgImage", e.target.value)} placeholder="https://..." />
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
