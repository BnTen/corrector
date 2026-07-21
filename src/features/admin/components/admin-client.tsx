"use client";

import { AppPageShell } from "@/shared/components/layout/app-page-shell";
import { PageHeader } from "@/shared/components/layout/page-header";
import { AdminLeadsPanel } from "@/features/admin/components/admin-leads-panel";
import { useAppNav } from "@/shared/lib/use-app-nav";
import { useI18n } from "@/shared/i18n/provider";

export function AdminClient({ email }: { email: string }) {
  const { t } = useI18n();
  const nav = useAppNav("admin", { showAdmin: true });

  return (
    <AppPageShell navItems={nav}>
      <PageHeader
        title={t("admin.title")}
        description={`${t("admin.funnel")} · ${email}`}
      />
      <AdminLeadsPanel />
    </AppPageShell>
  );
}
