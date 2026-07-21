import type { TopBarNavItem } from "@/shared/components/ui/top-bar";
import { translate } from "@/shared/i18n/translate";
import type { UiLocale } from "@/shared/i18n/config";

export function appNav(
  active: "workspace" | "dashboard" | "quiz" | "admin",
  options?: { showAdmin?: boolean; locale?: UiLocale }
): TopBarNavItem[] {
  const locale = options?.locale ?? "en";
  const t = (key: string) => translate(locale, key);

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
