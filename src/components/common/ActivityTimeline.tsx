import { cn } from "@/lib/utils";

export interface ActivityItem {
  label: string;
  timestamp: string;
  done: boolean;
}

export function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  return (
    <ol className="relative space-y-5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border-2",
                item.done ? "border-primary bg-primary" : "border-border bg-background"
              )}
            />
            {i < items.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
          </div>
          <div className="min-w-0 pb-1">
            <p
              className={cn(
                "text-sm font-medium",
                item.done ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item.label}
            </p>
            <p className="text-xs text-muted-foreground">{item.timestamp}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
