import { Link } from "@tanstack/react-router";
import { Zap, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { navItemClass, useIsNavActive, type NavUrl } from "./navItems";

const inactiveClass =
  "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground";
const activeClass =
  "bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:-left-3 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-sidebar-primary";

export function NavItemLink({
  title,
  url,
  icon: Icon,
  onNavigate,
}: {
  title: string;
  url: NavUrl;
  icon: LucideIcon;
  onNavigate?: (() => void) | undefined;
}) {
  const isActive = useIsNavActive()(url);

  return (
    <Link
      to={url}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(navItemClass, isActive ? activeClass : inactiveClass)}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-colors",
          isActive
            ? "text-sidebar-primary"
            : "text-sidebar-foreground/55 group-hover:text-sidebar-foreground",
        )}
        aria-hidden="true"
      />
      {title}
    </Link>
  );
}

export function NavSectionLabel({ children }: { children: string }) {
  return (
    <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
      {children}
    </p>
  );
}

export function BrandHeader() {
  return (
    <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm ring-1 ring-inset ring-primary-foreground/15">
        <Zap className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold tracking-tight text-foreground">
          AI Business Ops
        </p>
        <p className="truncate text-xs text-muted-foreground">Operations Dashboard</p>
      </div>
    </div>
  );
}
