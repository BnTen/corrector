import type { TopBarNavItem } from "@/shared/components/ui/top-bar";

export function appNav(
  active: "workspace" | "dashboard" | "admin",
  options?: { showAdmin?: boolean }
): TopBarNavItem[] {
  const items: TopBarNavItem[] = [
    {
      href: "/workspace",
      label: "Écrire",
      active: active === "workspace",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      active: active === "dashboard",
    },
  ];

  if (options?.showAdmin || active === "admin") {
    items.push({
      href: "/admin",
      label: "Admin",
      active: active === "admin",
    });
  }

  return items;
}
