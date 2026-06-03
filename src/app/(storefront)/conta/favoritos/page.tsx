import { Heart } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Favoritos" };

export default function FavoritosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Favoritos</h1>
      <div className="text-center py-16 rounded-2xl border border-border bg-card">
        <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Nenhum favorito ainda</h2>
        <p className="text-muted-foreground mb-6">Toque no coração de qualquer produto pra salvar aqui.</p>
        <Link href="/" className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90">
          Explorar produtos
        </Link>
      </div>
    </div>
  );
}
