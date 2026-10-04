import type { ReactNode } from "react";

import { formatLeadStatus, formatTicketStatus } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { LeadCategory, LeadStatus } from "@/types/lead";
import type { SupportPriority, SupportTicketStatus } from "@/types/supportTicket";

export type BadgeTone =
  "primary" | "info" | "success" | "warning" | "danger" | "hot" | "warm" | "cold" | "neutral";

const toneStyles: Record<BadgeTone, string> = {
  primary: "border-primary/20 bg-primary/10 text-primary",
  info: "border-info-border bg-info-soft text-info",
  success: "border-success-border bg-success-soft text-success",
  warning: "border-warning-border bg-warning-soft text-warning",
  danger: "border-danger-border bg-danger-soft text-danger",
  hot: "border-hot-border bg-hot-soft text-hot",
  warm: "border-warm-border bg-warm-soft text-warm",
  cold: "border-cold-border bg-cold-soft text-cold",
  neutral: "border-border bg-muted text-muted-foreground",
};

export function ToneBadge({
  tone,
  dot = false,
  className,
  children,
}: {
  tone: BadgeTone;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-md border px-2 text-xs font-medium leading-none",
        toneStyles[tone],
        className,
      )}
    >
      {dot && <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  );
}

const categoryTones: Record<LeadCategory, BadgeTone> = {
  HOT: "hot",
  WARM: "warm",
  COLD: "cold",
};

export function LeadCategoryBadge({ category }: { category: LeadCategory }) {
  return (
    <ToneBadge tone={categoryTones[category]} dot className="font-semibold tracking-wide">
      {category}
    </ToneBadge>
  );
}

const leadStatusTones: Record<LeadStatus, BadgeTone> = {
  NEW: "primary",
  CONTACTED: "info",
  QUALIFIED: "warning",
  CONVERTED: "success",
  LOST: "neutral",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <ToneBadge tone={leadStatusTones[status]}>{formatLeadStatus(status)}</ToneBadge>;
}

const priorityTones: Record<SupportPriority, BadgeTone> = {
  Critical: "danger",
  High: "warning",
  Normal: "neutral",
};

export function PriorityBadge({ priority }: { priority: SupportPriority }) {
  return (
    <ToneBadge tone={priorityTones[priority]} dot={priority !== "Normal"}>
      {priority}
    </ToneBadge>
  );
}

const ticketStatusTones: Record<SupportTicketStatus, BadgeTone> = {
  OPEN: "primary",
  IN_PROGRESS: "warning",
  WAITING_CUSTOMER: "info",
  RESOLVED: "success",
  CLOSED: "neutral",
};

export function TicketStatusBadge({ status }: { status: SupportTicketStatus }) {
  return <ToneBadge tone={ticketStatusTones[status]}>{formatTicketStatus(status)}</ToneBadge>;
}

export function HumanReviewBadge({ needs }: { needs: boolean }) {
  if (!needs) return <span className="text-xs text-muted-foreground">Not required</span>;
  return (
    <ToneBadge tone="warning" dot className="font-semibold">
      Needs review
    </ToneBadge>
  );
}
