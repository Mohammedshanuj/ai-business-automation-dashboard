import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: "default" | "hot" | "primary";
}

export function MetricCard({ label, value, icon: Icon, hint, tone = "default" }: MetricCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-lg",
            tone === "hot" && "bg-[var(--hot-bg)] text-[var(--hot-fg)]",
            tone === "primary" && "bg-primary/10 text-primary",
            tone === "default" && "bg-muted text-muted-foreground"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
