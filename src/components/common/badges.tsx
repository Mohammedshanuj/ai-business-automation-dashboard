import { cn } from "@/lib/utils";
import type { LeadCategory, LeadStatus, TicketPriority, TicketStatus } from "@/data/mock";

const base =
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap";

export function LeadCategoryBadge({ category }: { category: LeadCategory }) {
  const styles: Record<LeadCategory, string> = {
    HOT: "border-[var(--hot-border)] bg-[var(--hot-bg)] text-[var(--hot-fg)]",
    WARM: "border-[var(--warm-border)] bg-[var(--warm-bg)] text-[var(--warm-fg)]",
    COLD: "border-[var(--cold-border)] bg-[var(--cold-bg)] text-[var(--cold-fg)]",
  };
  const dots: Record<LeadCategory, string> = {
    HOT: "bg-[var(--hot-fg)]",
    WARM: "bg-[var(--warm-fg)]",
    COLD: "bg-[var(--cold-fg)]",
  };
  return (
    <span className={cn(base, styles[category])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dots[category])} />
      {category}
    </span>
  );
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const styles: Record<LeadStatus, string> = {
    NEW: "border-primary/25 bg-primary/10 text-primary",
    CONTACTED: "border-[var(--cold-border)] bg-[var(--cold-bg)] text-[var(--cold-fg)]",
    QUALIFIED: "border-[var(--warm-border)] bg-[var(--warm-bg)] text-[var(--warm-fg)]",
    CONVERTED: "border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success-fg)]",
    LOST: "border-border bg-muted text-muted-foreground",
  };
  return <span className={cn(base, styles[status])}>{status.replace("_", " ")}</span>;
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const styles: Record<TicketPriority, string> = {
    Critical: "border-[var(--hot-border)] bg-[var(--hot-bg)] text-[var(--hot-fg)]",
    High: "border-[var(--warm-border)] bg-[var(--warm-bg)] text-[var(--warm-fg)]",
    Normal: "border-border bg-muted text-muted-foreground",
  };
  return <span className={cn(base, styles[priority])}>{priority}</span>;
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const styles: Record<TicketStatus, string> = {
    OPEN: "border-primary/25 bg-primary/10 text-primary",
    IN_PROGRESS: "border-[var(--warm-border)] bg-[var(--warm-bg)] text-[var(--warm-fg)]",
    WAITING_CUSTOMER: "border-[var(--cold-border)] bg-[var(--cold-bg)] text-[var(--cold-fg)]",
    RESOLVED: "border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success-fg)]",
    CLOSED: "border-border bg-muted text-muted-foreground",
  };
  return <span className={cn(base, styles[status])}>{status.replace(/_/g, " ")}</span>;
}

export function HumanReviewBadge({ needs }: { needs: boolean }) {
  if (!needs) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span
      className={cn(
        base,
        "border-[var(--hot-border)] bg-[var(--hot-bg)] text-[var(--hot-fg)] font-semibold"
      )}
    >
      Human review
    </span>
  );
}
