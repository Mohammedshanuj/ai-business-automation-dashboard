import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricTone = "default" | "primary" | "hot" | "warning" | "info" | "success";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: MetricTone;
}

const iconTones: Record<MetricTone, string> = {
  default: "bg-muted text-muted-foreground ring-border",
  primary: "bg-primary/10 text-primary ring-primary/15",
  hot: "bg-hot-soft text-hot ring-hot-border",
  warning: "bg-warning-soft text-warning ring-warning-border",
  info: "bg-info-soft text-info ring-info-border",
  success: "bg-success-soft text-success ring-success-border",
};

export function MetricCard({ label, value, icon: Icon, hint, tone = "default" }: MetricCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ring-inset",
            iconTones[tone],
          )}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs font-medium text-muted-foreground">{hint}</p>}
    </Card>
  );
}
