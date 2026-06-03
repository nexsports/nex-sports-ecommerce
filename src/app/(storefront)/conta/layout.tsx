import { requireUser } from "@/lib/auth/session";
import Link from "next/link";
import { signOut } from "@/lib/auth/actions";
import { User, Package, MapPin, Heart, LogOut } from "lucide-react";

const items = [
  { href: "/conta",            label: "Minha conta", icon: User },
  { href: "/conta/pedidos",    label: "Pedidos",     icon: Package },
  { href: "/conta/enderecos",  label: "Endereços",   icon: MapPin },
  { href: "/conta/favoritos",  label: "Favoritos",   icon: Heart },
];

export default async function ContaLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/login?next=/conta");
  const name = (user.user_metadata as any)?.name ?? user.email;
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-10">
        <aside className="space-y-1">
          <div className="rounded-2xl border border-border bg-card p-4 mb-4">
            <p className="text-xs text-muted-foreground">Olá</p>
            <p className="font-semibold truncate">{name}</p>
          </div>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {items.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent/10 hover:text-accent transition-colors whitespace-nowrap"
              >
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
            <form action={signOut}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
              >
                <LogOut className="w-4 h-4" /> Sair
              </button>
            </form>
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
