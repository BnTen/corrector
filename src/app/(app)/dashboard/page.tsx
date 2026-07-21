import { DashboardClient } from "@/features/dashboard/components/dashboard-client";
import { requireUser } from "@/server/security/require-user";
import { isAdminEmail } from "@/server/security/admin";

export default async function DashboardPage() {
  const user = await requireUser();
  const showAdmin = isAdminEmail(user?.email);

  return <DashboardClient showAdmin={showAdmin} />;
}
