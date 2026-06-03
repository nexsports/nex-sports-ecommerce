import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold">Bem-vindo de volta</h1>
        <p className="text-muted-foreground text-sm">Entre na sua conta NEX</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <LoginForm />
      </div>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Não tem conta?{" "}
        <Link href="/cadastro" className="text-accent font-medium hover:underline">
          Crie agora
        </Link>
      </p>
    </div>
  );
}
