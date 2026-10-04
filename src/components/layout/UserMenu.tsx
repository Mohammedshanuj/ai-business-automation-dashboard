import { Link } from "@tanstack/react-router";
import { LogOut, Settings } from "lucide-react";

import { UserAvatar } from "@/components/layout/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/hooks/useSignOut";
import { useUserIdentity } from "@/hooks/useUserIdentity";

export function UserMenu() {
  const { identity } = useUserIdentity();
  const { signOut, isSigningOut } = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="shrink-0 cursor-pointer rounded-full outline-none ring-offset-background transition-shadow duration-150 hover:ring-2 hover:ring-border-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Open user menu"
        >
          <UserAvatar className="h-9 w-9" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2 font-normal">
          <UserAvatar className="h-9 w-9" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {identity?.displayName ?? "Signed in"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{identity?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isSigningOut}
          onSelect={() => {
            void signOut();
          }}
          className="text-danger focus:bg-danger-soft focus:text-danger"
        >
          <LogOut className="h-4 w-4" />
          {isSigningOut ? "Signing out…" : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
