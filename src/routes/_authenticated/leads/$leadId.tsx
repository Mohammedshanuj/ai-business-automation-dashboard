import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import {
  Mail,
  Phone,
  Building2,
  Sparkles,
  Globe,
  Calendar,
  User,
  Briefcase,
  Wallet,
  Clock,
  UserX,
  ListChecks,
  Activity,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LeadCategoryBadge, LeadStatusBadge } from "@/components/common/badges";
import { ActivityTimeline, type ActivityItem } from "@/components/common/ActivityTimeline";
import { SectionCard } from "@/components/common/SectionCard";
import {
  BackLink,
  DetailErrorState,
  FieldLabel,
  InfoItem,
  NotFoundState,
} from "@/components/common/detail";
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
import { useLead, useUpdateLeadStatus } from "@/hooks/useLeads";
import { displayText, formatDateTime, formatLeadStatus } from "@/lib/format";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/types/lead";

export const Route = createFileRoute("/_authenticated/leads/$leadId")({
  head: () => ({
    meta: [
      { title: "Lead Details — AI Business Operations Dashboard" },
      { name: "description", content: "AI qualification details and activity for this lead." },
    ],
  }),
  component: LeadDetailPage,
});

function LeadDetailPage() {
  const { leadId } = Route.useParams();
  const { data: lead, isLoading, isError, isNotFound, refetch } = useLead(leadId);
  const updateStatus = useUpdateLeadStatus();
  const statusRequestLock = useRef(false);
  const isUpdating = updateStatus.isPending;
  const pendingStatus = isUpdating ? updateStatus.variables?.status : undefined;

  function changeStatus(next: LeadStatus) {
    if (!lead || isUpdating || statusRequestLock.current || next === lead.status) return;

    statusRequestLock.current = true;
    updateStatus.mutate(
      { id: lead.id, status: next },
      {
        onSuccess: () => {
          toast.success(`Status updated to ${formatLeadStatus(next)}.`);
        },
        onError: () => {
          toast.error("Could not update the lead status. Please try again.");
        },
        onSettled: () => {
          statusRequestLock.current = false;
        },
      },
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Lead Details">
        <LeadDetailSkeleton />
      </DashboardLayout>
    );
  }

  if (isNotFound || !lead) {
    if (!isNotFound && isError) {
      return (
        <DashboardLayout title="Lead Details">
          <DetailErrorState
            title="Unable to load lead"
            description="Something went wrong while loading this lead. Please try again."
            actions={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void refetch();
                }}
              >
                Retry
              </Button>
            }
          />
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout title="Lead not found">
        <NotFoundState
          icon={UserX}
          title="Lead not found"
          description="This lead does not exist."
          action={
            <Button asChild>
              <Link to="/leads">Back to Leads</Link>
            </Button>
          }
        />
      </DashboardLayout>
    );
  }

  const score = scorePresentation(lead.lead_score);

  return (
    <DashboardLayout title="Lead Details">
      <div className="space-y-6">
        <BackLink to="/leads">Back to Leads</BackLink>

        <Card>
          <CardContent className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {lead.name}
                </h1>
                {lead.lead_category ? (
                  <LeadCategoryBadge category={lead.lead_category} />
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
                <LeadStatusBadge status={lead.status} />
              </div>
              <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  {displayText(lead.company)}
                </span>
                <span className="flex min-w-0 items-center gap-1.5">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{lead.email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {displayText(lead.phone)}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <div className="flex min-w-24 flex-col items-center rounded-lg border border-primary/20 bg-primary/[0.06] px-4 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
                  Score
                </p>
                <p className="text-3xl font-semibold tabular-nums leading-tight text-primary">
                  {score.value}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Status</p>
                <Select
                  value={lead.status}
                  disabled={isUpdating}
                  onValueChange={(value) => {
                    if (isLeadStatus(value)) changeStatus(value);
                  }}
                >
                  <SelectTrigger className="w-44" aria-label="Update status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatLeadStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <SectionCard title="Lead Information" icon={FileText}>
              <div className="space-y-6">
                <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
                  <InfoItem icon={User} label="Name">
                    {lead.name}
                  </InfoItem>
                  <InfoItem icon={Mail} label="Email">
                    {lead.email}
                  </InfoItem>
                  <InfoItem icon={Phone} label="Phone">
                    {displayText(lead.phone)}
                  </InfoItem>
                  <InfoItem icon={Building2} label="Company">
                    {displayText(lead.company)}
                  </InfoItem>
                  <InfoItem icon={Briefcase} label="Service">
                    {displayText(lead.service_required)}
                  </InfoItem>
                  <InfoItem icon={Wallet} label="Budget">
                    {displayText(lead.budget)}
                  </InfoItem>
                  <InfoItem icon={Clock} label="Timeline">
                    {displayText(lead.timeline)}
                  </InfoItem>
                  <InfoItem icon={Globe} label="Source">
                    {displayText(lead.source)}
                  </InfoItem>
                  <InfoItem icon={Calendar} label="Created">
                    {formatDateTime(lead.created_at)}
                  </InfoItem>
                </dl>
                <div>
                  <FieldLabel>Original Requirement</FieldLabel>
                  <p className="mt-2 whitespace-pre-line rounded-lg border border-border bg-surface-muted p-4 text-sm leading-relaxed text-foreground">
                    {displayText(lead.message)}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="AI Qualification"
              description="Generated by the lead scoring workflow"
              icon={Sparkles}
              variant="ai"
            >
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-muted-foreground">Lead score</span>
                      <span className="font-semibold tabular-nums text-foreground">
                        {score.label}
                      </span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-label="Lead score"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(score.width)}
                    >
                      <div
                        className="h-full rounded-full bg-primary transition-[width] duration-200"
                        style={{ width: `${score.width}%` }}
                      />
                    </div>
                  </div>
                  {lead.lead_category ? (
                    <LeadCategoryBadge category={lead.lead_category} />
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
                <div>
                  <FieldLabel>AI summary</FieldLabel>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    {displayText(lead.ai_summary)}
                  </p>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/[0.05] p-4">
                  <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Recommended action
                  </FieldLabel>
                  <p className="mt-1.5 text-sm font-medium leading-relaxed text-foreground">
                    {displayText(lead.recommended_action)}
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title="Actions" icon={ListChecks}>
              <div className="grid gap-2">
                <Button
                  disabled={isUpdating}
                  onClick={() =>
                    toast.info(
                      `Status is already ${lead.status}. Choose another status to save a change.`,
                    )
                  }
                >
                  Update Status
                </Button>
                <Button
                  variant="outline"
                  disabled={isUpdating}
                  loading={pendingStatus === "CONTACTED"}
                  onClick={() => changeStatus("CONTACTED")}
                >
                  Mark Contacted
                </Button>
                <Button
                  variant="outline"
                  disabled={isUpdating}
                  loading={pendingStatus === "QUALIFIED"}
                  onClick={() => changeStatus("QUALIFIED")}
                >
                  Mark Qualified
                </Button>
                <Button
                  variant="outline"
                  disabled={isUpdating}
                  loading={pendingStatus === "CONVERTED"}
                  onClick={() => changeStatus("CONVERTED")}
                >
                  Mark Converted
                </Button>
                <div className="my-1 h-px bg-border" aria-hidden="true" />
                <Button
                  variant="destructive-outline"
                  disabled={isUpdating}
                  loading={pendingStatus === "LOST"}
                  onClick={() => changeStatus("LOST")}
                >
                  Mark Lost
                </Button>
              </div>
            </SectionCard>

            <SectionCard
              title="Workflow activity"
              description="Current lifecycle for this lead. This is not a saved audit history."
              icon={Activity}
            >
              <ActivityTimeline items={workflowItems(lead)} />
            </SectionCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function LeadDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-32" />
      <Card>
        <CardContent className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-24 rounded-lg" />
            <Skeleton className="h-9 w-44" />
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="space-y-4 p-6 sm:p-6">
              <Skeleton className="h-5 w-40" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4 p-6 sm:p-6">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-2 p-6 sm:p-6">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
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

function workflowItems(lead: Lead): ActivityItem[] {
  if (lead.status === "LOST") {
    return [
      { label: "Lead received", timestamp: formatDateTime(lead.created_at), done: true },
      { label: "Current status: Lost", timestamp: formatDateTime(lead.updated_at), done: true },
    ];
  }

  const steps: readonly LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED"];
  const currentIndex = steps.indexOf(lead.status);

  return steps.map((status, index) => {
    let timestamp = "Not reached";
    if (index === 0) timestamp = formatDateTime(lead.created_at);
    else if (index === currentIndex) timestamp = formatDateTime(lead.updated_at);

    return {
      label:
        index === currentIndex
          ? `Current status: ${formatLeadStatus(status)}`
          : formatLeadStatus(status),
      timestamp,
      done: currentIndex >= 0 && index <= currentIndex,
    };
  });
}

function scorePresentation(score: number | null): { value: string; label: string; width: number } {
  if (score === null) {
    return { value: "—", label: "—", width: 0 };
  }

  const scale = score <= 10 ? 10 : 100;
  return {
    value: String(score),
    label: `${score}/${scale}`,
    width: Math.max(0, Math.min(100, (score / scale) * 100)),
  };
}

function isLeadStatus(value: string): value is LeadStatus {
  return LEAD_STATUSES.some((status) => status === value);
}
