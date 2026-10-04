import { cn } from "@/lib/utils";

export interface ActivityItem {
  label: string;
  timestamp: string;
  done: boolean;
}

export function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  return (
    <ol className="relative">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <li key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                  item.done
                    ? "bg-primary ring-4 ring-primary/15"
                    : "border-2 border-border-strong bg-card",
                )}
              />
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "my-1.5 w-px flex-1",
                    item.done && items[i + 1]?.done ? "bg-primary/35" : "bg-border",
                  )}
                />
              )}
            </div>
            <div className={cn("min-w-0", !isLast && "pb-5")}>
              <p
                className={cn(
                  "text-sm font-medium leading-5",
                  item.done ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.timestamp}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
