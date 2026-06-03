import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { MapPin } from "lucide-react";

export const metadata = { title: "Endereços" };

export default async function EnderecosPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Endereços</h1>
        <button
          type="button"
          className="h-10 px-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm"
          disabled
          title="Em breve"
        >
          + Adicionar
        </button>
      </div>
      {!addresses || addresses.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-border bg-card">
          <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Você ainda não cadastrou nenhum endereço.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((a: any) => (
            <div key={a.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="font-semibold">{a.label ?? "Endereço"}</p>
                {a.is_default && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">Padrão</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{a.recipient}</p>
              <p className="text-sm">{a.street}, {a.number}{a.complement ? ` — ${a.complement}` : ""}</p>
              <p className="text-sm text-muted-foreground">{a.neighborhood} · {a.city}/{a.state}</p>
              <p className="text-sm font-mono mt-1">{a.cep}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
