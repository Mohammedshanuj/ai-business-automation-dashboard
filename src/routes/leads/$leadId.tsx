import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, Building2, Sparkles, Globe, Calendar } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LeadCategoryBadge, LeadStatusBadge } from "@/components/common/badges";
import { ActivityTimeline } from "@/components/common/ActivityTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLead } from "@/data/mock";

export const Route = createFileRoute("/leads/$leadId")({
  loader: ({ params }) => {
    const lead = getLead(params.leadId);
    if (!lead) throw notFound();
    return { lead };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.lead.name ?? "Lead"} — Lead Details` },
      { name: "description", content: "AI qualification details and activity for this lead." },
    ],
  }),
  notFoundComponent: () => (
    <DashboardLayout title="Lead not found">
      <p className="text-sm text-muted-foreground">This lead does not exist.</p>
      <Link to="/leads" className="mt-4 inline-block text-sm font-medium text-primary">
        Back to leads
      </Link>
    </DashboardLayout>
  ),
  component: LeadDetailPage,
});

const fmt = (d: string) =>
  new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const notWired = () => toast.info("Status updates will be available once the backend is connected.");

function LeadDetailPage() {
  const { lead } = Route.useLoaderData();

  return (
    <DashboardLayout title="Lead Details">
      <div className="space-y-6">
        <Link
          to="/leads"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to leads
        </Link>

        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">{lead.name}</h1>
                <LeadCategoryBadge category={lead.lead_category} />
                <LeadStatusBadge status={lead.status} />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" />{lead.company}</span>
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{lead.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{lead.phone}</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Score</p>
                <p className="text-4xl font-semibold tabular-nums text-primary">{lead.lead_score}</p>
              </div>
              <Select defaultValue={lead.status} onValueChange={notWired}>
                <SelectTrigger className="w-40" aria-label="Update status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Lead Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <Info icon={Mail} label="Email" value={lead.email} />
                  <Info icon={Phone} label="Phone" value={lead.phone} />
                  <Info icon={Building2} label="Company" value={lead.company} />
                  <Info icon={Globe} label="Source" value={lead.source} />
                  <Info icon={Calendar} label="Created" value={fmt(lead.created_at)} />
                </dl>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Original message</p>
                  <p className="mt-2 rounded-lg border border-border bg-muted/40 p-4 text-sm leading-relaxed text-foreground">
                    {lead.message}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex-row items-center gap-2 space-y-0 pb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">AI Qualification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-muted-foreground">Lead score</span>
                      <span className="font-semibold tabular-nums">{lead.lead_score}/100</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${lead.lead_score}%` }} />
                    </div>
                  </div>
                  <LeadCategoryBadge category={lead.lead_category} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">AI summary</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground">{lead.ai_summary}</p>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">Recommended action</p>
                  <p className="mt-1.5 text-sm font-medium text-foreground">{lead.recommended_action}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button onClick={notWired}>Update Status</Button>
                <Button variant="outline" onClick={notWired}>Mark Contacted</Button>
                <Button variant="outline" onClick={notWired}>Mark Qualified</Button>
                <Button variant="outline" onClick={notWired}>Mark Converted</Button>
                <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={notWired}>
                  Mark Lost
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Lead Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityTimeline
                  items={[
                    { label: "Lead submitted", timestamp: fmt(lead.created_at), done: true },
                    { label: "AI qualification completed", timestamp: fmt(lead.created_at), done: true },
                    { label: "Lead routed to sales", timestamp: fmt(lead.updated_at), done: lead.status !== "NEW" },
                    { label: "Status changed", timestamp: lead.status === "NEW" ? "Pending" : fmt(lead.updated_at), done: lead.status !== "NEW" },
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="truncate text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  );
}
