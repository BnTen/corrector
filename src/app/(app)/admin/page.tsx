import { redirect } from "next/navigation";
import { AdminClient } from "@/features/admin/components/admin-client";
import { requireUser } from "@/server/security/require-user";
import { isAdminEmail } from "@/server/security/admin";

export default async function AdminPage() {
  const user = await requireUser();
  if (!user) redirect("/login?next=/admin");
  if (!isAdminEmail(user.email)) redirect("/dashboard");

  return <AdminClient email={user.email ?? ""} />;
}
