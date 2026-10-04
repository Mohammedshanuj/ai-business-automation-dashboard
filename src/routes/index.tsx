import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Flame, LifeBuoy, UserCheck, ArrowRight } from "lucide-react";
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
import { PageHeader } from "@/components/common/PageHeader";
import {
  LeadCategoryBadge,
  LeadStatusBadge,
  PriorityBadge,
  HumanReviewBadge,
  TicketStatusBadge,
} from "@/components/common/badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { leads, tickets } from "@/data/mock";

export const Route = createFileRoute("/")({
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

const CATEGORY_COLORS: Record<string, string> = {
  HOT: "var(--hot-fg)",
  WARM: "var(--warm-fg)",
  COLD: "var(--cold-fg)",
};

function OverviewPage() {
  const hotLeads = leads.filter((l) => l.lead_category === "HOT");
  const openTickets = tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS");
  const humanReview = tickets.filter((t) => t.needs_human && t.status !== "RESOLVED" && t.status !== "CLOSED");
  const criticalUnresolved = tickets.filter(
    (t) => t.priority === "Critical" && t.status !== "RESOLVED" && t.status !== "CLOSED"
  );
  const awaitingContact = leads.filter((l) => l.status === "NEW");

  const leadDistribution = (["HOT", "WARM", "COLD"] as const).map((c) => ({
    name: c,
    value: leads.filter((l) => l.lead_category === c).length,
  }));

  const ticketCategories = (["Billing", "Technical", "Sales", "General"] as const).map((c) => ({
    name: c,
    count: tickets.filter((t) => t.category === c).length,
  }));

  const recentLeads = [...leads]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);
  const recentTickets = [...tickets]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  const hotPct = Math.round((hotLeads.length / leads.length) * 100);

  return (
    <DashboardLayout title="Overview">
      <div className="space-y-6">
        <PageHeader
          title="Operations Overview"
          subtitle="AI-qualified leads and AI-triaged support at a glance."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total Leads" value={leads.length} icon={Users} hint="All time" />
          <MetricCard
            label="HOT Leads"
            value={hotLeads.length}
            icon={Flame}
            tone="hot"
            hint={`${hotPct}% of pipeline`}
          />
          <MetricCard
            label="Open Support Tickets"
            value={openTickets.length}
            icon={LifeBuoy}
            tone="primary"
            hint="Open or in progress"
          />
          <MetricCard
            label="Human Review Tickets"
            value={humanReview.length}
            icon={UserCheck}
            tone="hot"
            hint="Need operator attention"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Lead Distribution" description="AI qualification categories">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {leadDistribution.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Ticket Categories" description="Volume by AI-assigned category">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketCategories} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Recent Leads</CardTitle>
              <Link
                to="/leads"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="pl-6 font-medium">{lead.name}</TableCell>
                      <TableCell className="text-muted-foreground">{lead.company}</TableCell>
                      <TableCell className="font-semibold tabular-nums">{lead.lead_score}</TableCell>
                      <TableCell>
                        <LeadCategoryBadge category={lead.lead_category} />
                      </TableCell>
                      <TableCell>
                        <LeadStatusBadge status={lead.status} />
                      </TableCell>
                      <TableCell className="pr-6 text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Recent Support Tickets</CardTitle>
              <Link
                to="/support"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead className="pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="pl-6 font-medium">{ticket.customer_name}</TableCell>
                      <TableCell className="max-w-40 truncate text-muted-foreground">
                        {ticket.subject}
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell>
                        <HumanReviewBadge needs={ticket.needs_human} />
                      </TableCell>
                      <TableCell className="pr-6">
                        <TicketStatusBadge status={ticket.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Business Operations Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border border-border p-4">
                <p className="text-2xl font-semibold tabular-nums text-foreground">{hotPct}%</p>
                <p className="mt-1 text-sm text-muted-foreground">of leads are HOT</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-2xl font-semibold tabular-nums text-foreground">
                  {humanReview.length}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">tickets need human attention</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-2xl font-semibold tabular-nums text-[var(--hot-fg)]">
                  {criticalUnresolved.length}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">unresolved critical tickets</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-2xl font-semibold tabular-nums text-foreground">
                  {awaitingContact.length}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">leads awaiting first contact</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
