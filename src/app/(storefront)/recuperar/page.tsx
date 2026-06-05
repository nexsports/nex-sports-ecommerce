import Image from "next/image";
import Link from "next/link";
import { RecoverForm } from "./recover-form";

export const metadata = { title: "Recuperar senha" };

export default function RecoverPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:py-12">
      <div className="flex justify-center mb-6">
        <Image src="/branding/nex-logo.png" alt="NEX SPORTS" width={120} height={44} className="h-10 w-auto" />
      </div>
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Recuperar senha</h1>
        <p className="text-muted-foreground text-sm">Enviaremos um link pro seu e-mail.</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <RecoverForm />
      </div>
      <p className="text-center text-sm text-muted-foreground mt-6">
        <Link href="/login" className="text-accent hover:underline">Voltar pro login</Link>
      </p>
    </div>
  );
}
