import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, LifeBuoy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Support Tickets", url: "/support", icon: LifeBuoy },
];

export function MobileNav() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="h-4 w-4" />
        </div>
        <p className="text-sm font-semibold text-foreground">AI Business Ops</p>
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
    </div>
  );
}
