import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/layout/UserAvatar";
import { BrandHeader, NavItemLink, NavSectionLabel } from "@/components/layout/navigation";
import { navItemClass, primaryNavItems, settingsNavItem } from "@/components/layout/navItems";
import { useSignOut } from "@/hooks/useSignOut";
import { useUserIdentity } from "@/hooks/useUserIdentity";

export function AppSidebar() {
  const { signOut, isSigningOut } = useSignOut();
  const { identity } = useUserIdentity();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <BrandHeader />

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Main navigation">
        <NavSectionLabel>Workspace</NavSectionLabel>
        <div className="space-y-1">
          {primaryNavItems.map((item) => (
            <NavItemLink key={item.url} {...item} />
          ))}
        </div>
      </nav>

      <div className="space-y-1 border-t border-sidebar-border px-3 py-3">
        <NavItemLink {...settingsNavItem} />
        <button
          type="button"
          className={cn(
            navItemClass,
            "text-sidebar-foreground/75 hover:bg-danger-soft hover:text-danger disabled:pointer-events-none disabled:opacity-50",
          )}
          onClick={() => {
            void signOut();
          }}
          disabled={isSigningOut}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          {isSigningOut ? "Signing out…" : "Log out"}
        </button>
      </div>

      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-card px-3 py-2.5 shadow-xs">
          <UserAvatar className="h-9 w-9" />
          <div className="min-w-0 flex-1">
            {identity ? (
              <>
                <p className="truncate text-sm font-semibold text-foreground">
                  {identity.displayName}
                </p>
                <p className="truncate text-xs text-muted-foreground" title={identity.email}>
                  {identity.email}
                </p>
              </>
            ) : (
              <div className="space-y-1.5 py-0.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            )}
          </div>
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-success ring-2 ring-success-soft"
            title="Signed in"
            aria-label="Signed in"
            role="img"
          />
        </div>
        <p className="mt-2.5 px-1 text-center text-[11px] leading-none text-muted-foreground">
          © 2026 Shanuj
        </p>
      </div>
    </aside>
  );
}
