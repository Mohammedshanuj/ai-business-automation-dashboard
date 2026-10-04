import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: ReactNode;
  icon?: LucideIcon;
  action?: ReactNode;
  /** "ai" adds a restrained primary accent to mark AI-generated content. */
  variant?: "default" | "ai";
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

export function SectionCard({
  title,
  description,
  icon: Icon,
  action,
  variant = "default",
  className,
  contentClassName,
  children,
}: SectionCardProps) {
  const isAi = variant === "ai";

  return (
    <Card className={cn("overflow-hidden", isAi && "border-primary/25", className)}>
      <CardHeader
        className={cn(
          "flex-row items-center justify-between gap-3 border-b py-4 sm:py-4",
          isAi ? "border-primary/15 bg-primary/[0.04]" : "border-border/70",
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {Icon && (
            <span
              className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-md",
                isAi ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <CardTitle className="truncate text-[15px]">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-0.5 text-xs">{description}</CardDescription>
            )}
          </div>
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </CardHeader>
      <CardContent className={cn("pt-5 sm:pt-5", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
