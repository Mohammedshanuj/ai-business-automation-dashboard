import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "./MobileNav";

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <MobileNav />
        </SheetContent>
      </Sheet>

      <h2 className="min-w-0 flex-1 truncate text-base font-semibold text-foreground">{title}</h2>

      <div className="relative hidden w-64 shrink-0 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search…" className="pl-9" aria-label="Global search" />
      </div>

      <button
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--hot-fg)]" />
      </button>

      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
          AO
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
