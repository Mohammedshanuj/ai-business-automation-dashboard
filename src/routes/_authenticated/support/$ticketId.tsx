import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import {
  Copy,
  Sparkles,
  AlertTriangle,
  Mail,
  User,
  Globe,
  Calendar,
  Inbox,
  MessageSquare,
  Activity,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  PriorityBadge,
  TicketStatusBadge,
  HumanReviewBadge,
  ToneBadge,
} from "@/components/common/badges";
import { ActivityTimeline, type ActivityItem } from "@/components/common/ActivityTimeline";
import { SectionCard } from "@/components/common/SectionCard";
import { BackLink, DetailErrorState, FieldLabel, NotFoundState } from "@/components/common/detail";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupportTicket, useUpdateSupportTicketStatus } from "@/hooks/useSupportTickets";
import { displayText, formatDateTime, formatTicketStatus } from "@/lib/format";
import {
  SUPPORT_TICKET_STATUSES,
  type SupportTicket,
  type SupportTicketStatus,
} from "@/types/supportTicket";

export const Route = createFileRoute("/_authenticated/support/$ticketId")({
  head: () => ({
    meta: [
      { title: "Ticket Details — AI Business Operations Dashboard" },
      {
        name: "description",
        content:
          "AI triage analysis, suggested reply, and workflow stages for this support ticket.",
      },
    ],
  }),
  component: TicketDetailPage,
});

function TicketDetailPage() {
  const { ticketId } = Route.useParams();
  const { data: ticket, isLoading, isError, isNotFound, refetch } = useSupportTicket(ticketId);
  const updateStatus = useUpdateSupportTicketStatus();
  const statusRequestLock = useRef(false);
  const isUpdating = updateStatus.isPending;
  const pendingStatus = isUpdating ? updateStatus.variables?.status : undefined;

  function changeStatus(next: SupportTicketStatus) {
    if (!ticket || isUpdating || statusRequestLock.current || next === ticket.status) return;

    statusRequestLock.current = true;
    updateStatus.mutate(
      { id: ticket.id, status: next },
      {
        onSuccess: () => {
          toast.success(`Status updated to ${formatTicketStatus(next)}.`);
        },
        onError: () => {
          toast.error("Could not update the ticket status. Please try again.");
        },
        onSettled: () => {
          statusRequestLock.current = false;
        },
      },
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Ticket Details">
        <TicketDetailSkeleton />
      </DashboardLayout>
    );
  }

  if (isNotFound || !ticket) {
    if (!isNotFound && isError) {
      return (
        <DashboardLayout title="Ticket Details">
          <DetailErrorState
            title="Unable to load ticket"
            description="Something went wrong while loading this support ticket. Please try again."
            actions={
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void refetch();
                  }}
                >
                  Retry
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/support">Back to Support Tickets</Link>
                </Button>
              </>
            }
          />
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout title="Ticket not found">
        <NotFoundState
          icon={Inbox}
          title="Ticket not found"
          description="This support ticket does not exist or you do not have access to it."
          action={
            <Button asChild>
              <Link to="/support">Back to Support Tickets</Link>
            </Button>
          }
        />
      </DashboardLayout>
    );
  }

  const reply = ticket.suggested_reply?.trim() ? ticket.suggested_reply : null;

  const copyReply = async () => {
    if (!reply) return;
    try {
      await navigator.clipboard.writeText(reply);
      toast.success("Suggested reply copied to clipboard");
    } catch {
      toast.error("Could not copy reply");
    }
  };

  return (
    <DashboardLayout title="Ticket Details">
      <div className="space-y-6">
        <BackLink to="/support">Back to Support Tickets</BackLink>

        <Card>
          <CardContent className="space-y-4 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 space-y-3">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {ticket.subject}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium text-foreground">{ticket.customer_name}</span>
                  <span className="text-border-strong" aria-hidden="true">
                    •
                  </span>
                  {ticket.category && <ToneBadge tone="neutral">{ticket.category}</ToneBadge>}
                  {ticket.priority && <PriorityBadge priority={ticket.priority} />}
                  <TicketStatusBadge status={ticket.status} />
                  <HumanReviewBadge needs={ticket.needs_human} />
                </div>
              </div>
              <div className="shrink-0 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Status</p>
                <Select
                  value={ticket.status}
                  disabled={isUpdating}
                  onValueChange={(value) => {
                    if (isSupportTicketStatus(value)) changeStatus(value);
                  }}
                >
                  <SelectTrigger className="w-52" aria-label="Update status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORT_TICKET_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatTicketStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {ticket.needs_human && (
              <div
                className="flex items-center gap-2.5 rounded-lg border border-warning-border bg-warning-soft px-4 py-3 text-sm font-medium text-warning"
                role="status"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                AI flagged this ticket for human review before replying.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <SectionCard title="Customer Message" icon={MessageSquare}>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    {ticket.customer_name}
                  </span>
                  <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{ticket.customer_email}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Globe className="h-4 w-4" aria-hidden="true" />
                    {displayText(ticket.source)}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    {formatDateTime(ticket.created_at)}
                  </span>
                </div>
                <div>
                  <FieldLabel>Subject</FieldLabel>
                  <p className="mt-1.5 text-sm font-medium text-foreground">{ticket.subject}</p>
                </div>
                <p className="whitespace-pre-line rounded-lg border border-border bg-surface-muted p-4 text-sm leading-relaxed text-foreground">
                  {displayText(ticket.message)}
                </p>
              </div>
            </SectionCard>

            <SectionCard
              title="Suggested Reply"
              description="AI-drafted response — review before sending"
              icon={Bot}
              variant="ai"
              action={
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!reply}
                  onClick={() => void copyReply()}
                >
                  <Copy aria-hidden="true" />
                  Copy Reply
                </Button>
              }
            >
              {reply ? (
                <div className="whitespace-pre-line rounded-lg border border-primary/15 bg-primary/[0.04] p-5 text-sm leading-relaxed text-foreground">
                  {reply}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border-strong p-5 text-center text-sm text-muted-foreground">
                  No suggested reply has been generated for this ticket yet.
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
                <Button
                  disabled={isUpdating || ticket.status === "IN_PROGRESS"}
                  loading={pendingStatus === "IN_PROGRESS"}
                  onClick={() => changeStatus("IN_PROGRESS")}
                >
                  Mark In Progress
                </Button>
                <Button
                  variant="outline"
                  disabled={isUpdating || ticket.status === "RESOLVED"}
                  loading={pendingStatus === "RESOLVED"}
                  onClick={() => changeStatus("RESOLVED")}
                >
                  Resolve Ticket
                </Button>
                <Button
                  variant="destructive-outline"
                  className="sm:ml-auto"
                  disabled={isUpdating || ticket.status === "CLOSED"}
                  loading={pendingStatus === "CLOSED"}
                  onClick={() => changeStatus("CLOSED")}
                >
                  Close Ticket
                </Button>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard
              title="AI Analysis"
              description="Automated triage result"
              icon={Sparkles}
              variant="ai"
            >
              <div className="space-y-5 text-sm">
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs text-muted-foreground">Category</dt>
                    <dd className="mt-1.5 font-medium text-foreground">
                      {displayText(ticket.category)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Priority</dt>
                    <dd className="mt-1.5">
                      {ticket.priority ? (
                        <PriorityBadge priority={ticket.priority} />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-muted-foreground">Human review</dt>
                    <dd className="mt-1.5">
                      <HumanReviewBadge needs={ticket.needs_human} />
                    </dd>
                  </div>
                </dl>
                <div className="border-t border-primary/10 pt-4">
                  <FieldLabel>AI summary</FieldLabel>
                  <p className="mt-2 leading-relaxed text-foreground">
                    {displayText(ticket.ai_summary)}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Workflow stages"
              description="Automation stages for this ticket. This is not a saved audit history."
              icon={Activity}
            >
              <ActivityTimeline items={workflowItems(ticket)} />
            </SectionCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function TicketDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-40" />
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-8 w-72 max-w-full" />
            <Skeleton className="h-5 w-96 max-w-full" />
          </div>
          <Skeleton className="h-9 w-52" />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="space-y-4 p-6 sm:p-6">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-80 max-w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-28 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4 p-6 sm:p-6">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-32 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-36" />
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-28" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 p-6 sm:p-6">
              <Skeleton className="h-5 w-32" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4 p-6 sm:p-6">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function workflowItems(ticket: SupportTicket): ActivityItem[] {
  const triaged =
    ticket.category !== null || ticket.priority !== null || ticket.ai_summary !== null;
  const replyGenerated = ticket.suggested_reply !== null && ticket.suggested_reply.trim() !== "";

  const items: ActivityItem[] = [
    { label: "Email received", timestamp: formatDateTime(ticket.created_at), done: true },
    { label: "AI triage", timestamp: triaged ? "Completed" : "Pending", done: triaged },
    {
      label: "Reply suggested",
      timestamp: replyGenerated ? "Completed" : "Pending",
      done: replyGenerated,
    },
  ];

  if (ticket.needs_human) {
    items.push({ label: "Flagged for human review", timestamp: "Required", done: true });
  }

  items.push({
    label: `Current status: ${formatTicketStatus(ticket.status)}`,
    timestamp: `Last updated ${formatDateTime(ticket.updated_at)}`,
    done: ticket.status !== "OPEN",
  });

  return items;
}

function isSupportTicketStatus(value: string): value is SupportTicketStatus {
  return SUPPORT_TICKET_STATUSES.some((status) => status === value);
}
