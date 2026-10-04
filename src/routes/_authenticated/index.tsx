import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Flame, LifeBuoy, UserCheck, ArrowRight, Inbox, AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/common/MetricCard";
import { ChartCard } from "@/components/common/ChartCard";
import { ChartTooltip } from "@/components/common/ChartTooltip";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { EmptyState } from "@/components/common/EmptyState";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import {
  LeadCategoryBadge,
  LeadStatusBadge,
  PriorityBadge,
  HumanReviewBadge,
  TicketStatusBadge,
} from "@/components/common/badges";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboard } from "@/hooks/useDashboard";
import { displayText, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  DashboardData,
  LeadDistributionItem,
  TicketCategoryDistributionItem,
} from "@/types/dashboard";
import type { LeadCategory } from "@/types/lead";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Overview — AI Business Operations Dashboard" },
      {
        name: "description",
        content:
          "Operational overview of AI-qualified leads and AI-triaged support tickets, with distribution charts and business insights.",
      },
      { property: "og:title", content: "AI Business Operations Dashboard" },
      {
        property: "og:description",
        content:
          "Internal operations platform combining AI lead qualification and AI customer support triage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OverviewPage,
});

const CATEGORY_COLORS: Record<LeadCategory, string> = {
  HOT: "var(--hot)",
  WARM: "var(--warm)",
  COLD: "var(--cold)",
};

const AXIS_TICK = { fontSize: 12, fill: "var(--muted-foreground)" };

function OverviewPage() {
  const { data, isLoading, isError, isFetching, refetch } = useDashboard();

  return (
    <DashboardLayout title="Overview">
      <div className="space-y-6">
        <PageHeader
          title="Operations Overview"
          subtitle="AI-qualified leads and AI-triaged support at a glance."
        />

        {isError && !data ? (
          <DashboardError isRetrying={isFetching} onRetry={() => void refetch()} />
        ) : isLoading || !data ? (
          <DashboardSkeleton />
        ) : (
          <DashboardContent data={data} />
        )}
      </div>
    </DashboardLayout>
  );
}

function ViewAllLink({ to }: { to: "/leads" | "/support" }) {
  return (
    <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
      <Link to={to}>
        View all <ArrowRight aria-hidden="true" />
      </Link>
    </Button>
  );
}

function DashboardContent({ data }: { data: DashboardData }) {
  const { metrics, summary } = data;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Leads"
          value={metrics.totalLeads}
          icon={Users}
          tone="primary"
          hint="All time"
        />
        <MetricCard
          label="HOT Leads"
          value={metrics.hotLeads}
          icon={Flame}
          tone="hot"
          hint={`${summary.hotLeadPercentage}% of pipeline`}
        />
        <MetricCard
          label="Open Support Tickets"
          value={metrics.openSupportTickets}
          icon={LifeBuoy}
          tone="info"
          hint="Open or in progress"
        />
        <MetricCard
          label="Human Review Tickets"
          value={metrics.humanReviewTickets}
          icon={UserCheck}
          tone="warning"
          hint="Need operator attention"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Lead Distribution" description="AI qualification categories">
          <LeadDistributionChart distribution={data.leadDistribution} />
        </ChartCard>

        <ChartCard title="Ticket Categories" description="Volume by AI-assigned category">
          <TicketCategoryChart distribution={data.ticketCategoryDistribution} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Recent Leads"
          action={<ViewAllLink to="/leads" />}
          contentClassName="p-0 sm:p-0"
        >
          {data.recentLeads.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No leads yet"
              description="When new enquiries arrive, the latest qualified leads will show up here."
            />
          ) : (
            <Table className="min-w-[560px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5 sm:pl-6">Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-5 sm:pr-6">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="pl-5 font-medium text-foreground sm:pl-6">
                      {lead.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {displayText(lead.company)}
                    </TableCell>
                    <TableCell className="font-semibold tabular-nums text-foreground">
                      {lead.lead_score ?? "—"}
                    </TableCell>
                    <TableCell>
                      {lead.lead_category ? (
                        <LeadCategoryBadge category={lead.lead_category} />
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <LeadStatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap pr-5 text-muted-foreground sm:pr-6">
                      {formatDate(lead.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>

        <SectionCard
          title="Recent Support Tickets"
          action={<ViewAllLink to="/support" />}
          contentClassName="p-0 sm:p-0"
        >
          {data.recentTickets.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No support tickets yet"
              description="Incoming support emails will be triaged by AI and appear here."
            />
          ) : (
            <Table className="min-w-[560px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5 sm:pl-6">Customer</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead className="pr-5 sm:pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="pl-5 font-medium text-foreground sm:pl-6">
                      {ticket.customer_name}
                    </TableCell>
                    <TableCell className="max-w-40 truncate text-muted-foreground">
                      {ticket.subject}
                    </TableCell>
                    <TableCell>
                      {ticket.priority ? (
                        <PriorityBadge priority={ticket.priority} />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <HumanReviewBadge needs={ticket.needs_human} />
                    </TableCell>
                    <TableCell className="pr-5 sm:pr-6">
                      <TicketStatusBadge status={ticket.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Business Operations Summary"
        description="Signals that need attention across the pipeline"
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryStat value={`${summary.hotLeadPercentage}%`} label="of leads are HOT" />
          <SummaryStat value={summary.humanReviewCount} label="tickets need human attention" />
          <SummaryStat
            value={summary.unresolvedCriticalTickets}
            label="unresolved critical tickets"
            emphasis={summary.unresolvedCriticalTickets > 0}
          />
          <SummaryStat value={summary.leadsAwaitingContact} label="leads awaiting first contact" />
        </div>
      </SectionCard>
    </>
  );
}

function SummaryStat({
  value,
  label,
  emphasis = false,
}: {
  value: ReactNode;
  label: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        emphasis ? "border-danger-border bg-danger-soft" : "border-border bg-surface-muted",
      )}
    >
      <p
        className={cn(
          "text-2xl font-semibold tabular-nums tracking-tight",
          emphasis ? "text-danger" : "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ChartEmpty({ children }: { children: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
      {children}
    </div>
  );
}

function LeadDistributionChart({ distribution }: { distribution: LeadDistributionItem[] }) {
  const chartData = distribution.map((item) => ({ name: item.category, value: item.count }));
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return <ChartEmpty>No leads yet</ChartEmpty>;
  }

  return (
    <div className="relative h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={90}
            paddingAngle={2}
            cy="45%"
            stroke="var(--card)"
            strokeWidth={2}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip valueLabel="Leads" />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingTop: 8 }}
            formatter={(value) => (
              <span className="ml-1 mr-3 text-xs font-medium text-muted-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-x-0 top-[45%] -translate-y-1/2 text-center">
        <p className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
          {total}
        </p>
        <p className="text-xs text-muted-foreground">Leads</p>
      </div>
    </div>
  );
}

function TicketCategoryChart({ distribution }: { distribution: TicketCategoryDistributionItem[] }) {
  const chartData = distribution.map((item) => ({ name: item.category, count: item.count }));
  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return <ChartEmpty>No support tickets yet</ChartEmpty>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="name"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            tickMargin={8}
          />
          <YAxis
            allowDecimals={false}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.7 }}
            content={<ChartTooltip valueLabel="Tickets" />}
          />
          <Bar dataKey="count" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} className="space-y-3 p-5">
            <div className="flex items-start justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Lead Distribution" description="AI qualification categories">
          <Skeleton className="h-64 w-full" />
        </ChartCard>
        <ChartCard title="Ticket Categories" description="Volume by AI-assigned category">
          <Skeleton className="h-64 w-full" />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Recent Leads" contentClassName="p-0 sm:p-0">
          <TableSkeleton rows={5} />
        </SectionCard>
        <SectionCard title="Recent Support Tickets" contentClassName="p-0 sm:p-0">
          <TableSkeleton rows={5} />
        </SectionCard>
      </div>

      <SectionCard
        title="Business Operations Summary"
        description="Signals that need attention across the pipeline"
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="rounded-lg border border-border bg-surface-muted p-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-2 h-4 w-40" />
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}

function DashboardError({ isRetrying, onRetry }: { isRetrying: boolean; onRetry: () => void }) {
  return (
    <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-xl border border-danger-border bg-danger-soft">
        <AlertCircle className="h-5 w-5 text-danger" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-foreground">Unable to load the dashboard</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Something went wrong while loading operations data. Please try again.
      </p>
      <Button variant="outline" size="sm" className="mt-4" loading={isRetrying} onClick={onRetry}>
        {isRetrying ? "Retrying…" : "Retry"}
      </Button>
    </Card>
  );
}
