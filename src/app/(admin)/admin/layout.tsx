import { getSession } from "@/lib/auth/session";
import { AdminShell } from "./shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth enforced by middleware. Layout reads user for sidebar display.
  // Login page bypasses middleware guard so this still renders for it.
  const user = await getSession();

  // If no user (login page), render children without shell
  if (!user) return <>{children}</>;

  return <AdminShell userEmail={user.email ?? ""}>{children}</AdminShell>;
}
