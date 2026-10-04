import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandHeader, NavItemLink, NavSectionLabel } from "@/components/layout/navigation";
import { navItemClass, primaryNavItems, settingsNavItem } from "@/components/layout/navItems";
import { useSignOut } from "@/hooks/useSignOut";

export function MobileNav({ onNavigate }: { onNavigate?: () => void }) {
  const { signOut, isSigningOut } = useSignOut();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <BrandHeader />
      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Main navigation">
        <NavSectionLabel>Workspace</NavSectionLabel>
        <div className="space-y-1">
          {primaryNavItems.map((item) => (
            <NavItemLink key={item.url} {...item} onNavigate={onNavigate} />
          ))}
        </div>
      </nav>
      <div className="space-y-1 border-t border-sidebar-border px-3 py-3">
        <NavItemLink {...settingsNavItem} onNavigate={onNavigate} />
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
        <p className="px-1 pt-2 text-center text-[11px] leading-none text-muted-foreground">
          © 2026 Shanuj
        </p>
      </div>
    </div>
  );
}
