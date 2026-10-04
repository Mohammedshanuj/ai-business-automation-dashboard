import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, LifeBuoy, Settings, LogOut, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Support Tickets", url: "/support", icon: LifeBuoy },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">AI Business Ops</p>
          <p className="text-xs text-muted-foreground">Operations Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <Link
            key={item.title}
            to={item.url}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.url)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="px-3 pb-4">
        <Separator className="mb-3" />
        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Settings (coming soon)"
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </button>
        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Log out (coming soon)"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Log out
        </button>
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              AO
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">Alex Operator</p>
            <p className="truncate text-xs text-muted-foreground">Operations Lead</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
