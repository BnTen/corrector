"use client";

import { TopBar } from "@/shared/components/ui/top-bar";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { AdminLeadsPanel } from "@/features/admin/components/admin-leads-panel";
import { useAppNav } from "@/shared/lib/use-app-nav";
import { useI18n } from "@/shared/i18n/provider";

export function AdminClient({ email }: { email: string }) {
  const { t } = useI18n();
  const nav = useAppNav("admin", { showAdmin: true });

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-ds-canvas">
      <TopBar navItems={nav} showEditorCta={false}>
        <SignOutButton />
      </TopBar>

      <div className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col gap-4 overflow-y-auto px-3 py-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ds-ink sm:text-2xl">
            {t("admin.title")}
          </h1>
          <p className="mt-0.5 text-sm text-ds-muted">
            {t("admin.funnel")} · {email}
          </p>
        </div>
        <AdminLeadsPanel />
      </div>
    </div>
  );
}
