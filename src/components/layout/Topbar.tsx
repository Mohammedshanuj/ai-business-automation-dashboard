import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GlobalSearch } from "./GlobalSearch";
import { MobileNav } from "./MobileNav";
import { NotificationBell } from "./NotificationBell";
import { UserMenu } from "./UserMenu";

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 sm:gap-3 sm:px-6 lg:px-8">
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Open navigation"
          >
            <Menu aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 border-sidebar-border bg-sidebar p-0"
          aria-describedby={undefined}
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <MobileNav onNavigate={() => setNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <h2 className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground sm:text-[15px]">
        {title}
      </h2>

      <GlobalSearch />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationBell />
      </div>
      <div className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
      <UserMenu />
    </header>
  );
}
