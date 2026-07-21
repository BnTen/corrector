import { WorkspacePageClient } from "@/features/editor/components/workspace-page-client";
import { requireUser } from "@/server/security/require-user";
import { isAdminEmail } from "@/server/security/admin";

export default async function WorkspacePage() {
  const user = await requireUser();
  const showAdmin = isAdminEmail(user?.email);

  return <WorkspacePageClient showAdmin={showAdmin} />;
}
