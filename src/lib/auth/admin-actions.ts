"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { AuthState } from "./actions";

const adminSigninSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export async function signInAdmin(
  _: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = adminSigninSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "E-mail ou senha incorretos" };

  const role =
    data.user.app_metadata?.role ?? data.user.user_metadata?.role;
  if (role !== "admin") {
    await supabase.auth.signOut();
    return { error: "Acesso restrito a administradores" };
  }

  revalidatePath("/", "layout");
  redirect("/admin/dashboard");
}
