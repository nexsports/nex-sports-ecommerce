import { requireUser } from "@/lib/auth/session";

export const metadata = { title: "Minha conta" };

export default async function ContaHomePage() {
  const user = await requireUser();
  const name = (user.user_metadata as any)?.name ?? user.email;
  return (
    <div className="space-y-5 md:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Olá, {String(name).split(" ")[0]} 👋</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Bem-vindo à sua área NEX.</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "Pedidos", value: "0", hint: "Total realizado" },
          { label: "Em andamento", value: "0", hint: "Pedidos abertos" },
          { label: "Favoritos", value: "0", hint: "Produtos salvos" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl md:rounded-2xl border border-border bg-card p-3 md:p-5">
            <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl md:text-3xl font-bold mt-1">{s.value}</p>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1 md:mt-2 hidden sm:block">{s.hint}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold mb-3">Próximos passos</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Cadastre um endereço pra checkout mais rápido</li>
          <li>• Explore as categorias e adicione favoritos</li>
          <li>• Use o cupom <span className="font-mono text-accent">BEMVINDO10</span> na primeira compra</li>
        </ul>
      </div>
    </div>
  );
}
