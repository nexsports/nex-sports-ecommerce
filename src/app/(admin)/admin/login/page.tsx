import { LoginForm } from "./login-form";

export const metadata = { title: "Login — NEX Admin" };

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-black text-3xl">
            NEX
          </span>
          <span className="text-foreground font-bold text-2xl ml-1">ADMIN</span>
          <p className="text-sm text-muted-foreground mt-2">
            Acesse o painel administrativo
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
