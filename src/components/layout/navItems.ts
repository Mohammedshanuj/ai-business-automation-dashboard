import { useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, LifeBuoy, Settings, Users, type LucideIcon } from "lucide-react";

export type NavUrl = "/" | "/leads" | "/support" | "/settings";

export const primaryNavItems: ReadonlyArray<{ title: string; url: NavUrl; icon: LucideIcon }> = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Support Tickets", url: "/support", icon: LifeBuoy },
];

export const settingsNavItem = { title: "Settings", url: "/settings", icon: Settings } as const;

export const navItemClass =
  "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring";

export function useIsNavActive() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));
}
