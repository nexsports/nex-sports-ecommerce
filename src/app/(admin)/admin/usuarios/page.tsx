import { UsuariosClient } from "./usuarios-client";
import { getStaffUsers } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Usuários — NEX Admin" };

export default async function UsuariosPage() {
  const users = await getStaffUsers();
  return <UsuariosClient initialUsers={users} />;
}
