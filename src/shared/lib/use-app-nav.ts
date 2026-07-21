"use client";

import type { TopBarNavItem } from "@/shared/components/ui/top-bar";
import { useI18n } from "@/shared/i18n/provider";

export function useAppNav(
  active: "workspace" | "dashboard" | "quiz" | "admin",
  options?: { showAdmin?: boolean }
): TopBarNavItem[] {
  const { t } = useI18n();

  const items: TopBarNavItem[] = [
    {
      href: "/workspace",
      label: t("nav.write"),
      active: active === "workspace",
    },
    {
      href: "/quiz",
      label: t("nav.quiz"),
      active: active === "quiz",
    },
    {
      href: "/dashboard",
      label: t("nav.dashboard"),
      active: active === "dashboard",
    },
  ];

  if (options?.showAdmin || active === "admin") {
    items.push({
      href: "/admin",
      label: t("nav.admin"),
      active: active === "admin",
    });
  }

  return items;
}
