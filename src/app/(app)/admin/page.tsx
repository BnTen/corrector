import { redirect } from "next/navigation";
import { TopBar } from "@/shared/components/ui/top-bar";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { AdminLeadsPanel } from "@/features/admin/components/admin-leads-panel";
import { requireUser } from "@/server/security/require-user";
import { isAdminEmail } from "@/server/security/admin";
import { appNav } from "@/shared/lib/app-nav";

export default async function AdminPage() {
  const user = await requireUser();
  if (!user) redirect("/login?next=/admin");
  if (!isAdminEmail(user.email)) redirect("/dashboard");

  return (
    <div className="flex min-h-dvh flex-col bg-ds-canvas">
      <TopBar navItems={appNav("admin")} showEditorCta={false}>
        <SignOutButton />
      </TopBar>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 px-3 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ds-ink sm:text-3xl">
            Admin
          </h1>
          <p className="mt-1 text-sm text-ds-muted">
            Funnel leads · {user.email}
          </p>
        </div>
        <AdminLeadsPanel />
      </div>
    </div>
  );
}
