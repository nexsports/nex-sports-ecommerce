"use client";
import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RecoverForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, {});
  if (state.success) {
    return (
      <p className="text-sm text-center text-accent">
        ✓ Se o e-mail estiver cadastrado, você receberá o link em alguns instantes.
      </p>
    );
  }
  return (
    <form action={action} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" className="h-11" />
      </div>
      {state.error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{state.error}</p>
      )}
      <Button type="submit" disabled={pending} className="w-full h-11">
        {pending ? "Enviando..." : "Enviar link"}
      </Button>
    </form>
  );
}
