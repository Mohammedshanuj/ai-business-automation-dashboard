import { Link } from "@tanstack/react-router";
import { Bell, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { PriorityBadge } from "@/components/common/badges";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useTicketsNeedingAttention } from "@/hooks/useSupportTickets";

const MAX_ITEMS = 5;

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = useTicketsNeedingAttention();
  const count = data?.length ?? 0;
  const items = data?.slice(0, MAX_ITEMS) ?? [];

  const label =
    count > 0
      ? `Notifications: ${count} ticket${count === 1 ? "" : "s"} need human review`
      : "Notifications";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative shrink-0 text-muted-foreground hover:text-foreground"
          aria-label={label}
        >
          <Bell aria-hidden="true" />
          {count > 0 && (
            <span className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground ring-2 ring-background">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 overflow-hidden p-0">
        <div className="border-b border-border bg-surface-muted px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Needs human review</p>
          <p className="text-xs text-muted-foreground">
            {isLoading
              ? "Checking support tickets…"
              : `${count} open ticket${count === 1 ? "" : "s"} flagged by AI`}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            Unable to load support tickets.
          </p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
            <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No tickets need human review</p>
          </div>
        ) : (
          <ul className="max-h-80 overflow-y-auto py-1">
            {items.map((ticket) => (
              <li key={ticket.id}>
                <Link
                  to="/support/$ticketId"
                  params={{ ticketId: ticket.id }}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {ticket.customer_name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {ticket.subject}
                    </span>
                  </span>
                  {ticket.priority && <PriorityBadge priority={ticket.priority} />}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {count > MAX_ITEMS && (
          <div className="border-t border-border px-4 py-2.5">
            <Link
              to="/support"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all support tickets
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
