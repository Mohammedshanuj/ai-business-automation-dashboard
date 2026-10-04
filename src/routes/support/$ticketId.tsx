import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Copy, Sparkles, AlertTriangle, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PriorityBadge, TicketStatusBadge, HumanReviewBadge } from "@/components/common/badges";
import { ActivityTimeline } from "@/components/common/ActivityTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTicket } from "@/data/mock";

export const Route = createFileRoute("/support/$ticketId")({
  loader: ({ params }) => {
    const ticket = getTicket(params.ticketId);
    if (!ticket) throw notFound();
    return { ticket };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.ticket.subject ?? "Ticket"} — Ticket Details` },
      { name: "description", content: "AI triage analysis, suggested reply, and activity for this support ticket." },
    ],
  }),
  notFoundComponent: () => (
    <DashboardLayout title="Ticket not found">
      <p className="text-sm text-muted-foreground">This ticket does not exist.</p>
      <Link to="/support" className="mt-4 inline-block text-sm font-medium text-primary">Back to tickets</Link>
    </DashboardLayout>
  ),
  component: TicketDetailPage,
});

const fmt = (d: string) =>
  new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

const notWired = () => toast.info("Ticket updates will be available once the backend is connected.");

function TicketDetailPage() {
  const { ticket } = Route.useLoaderData();
  const done = ticket.status !== "OPEN";

  const copyReply = async () => {
    try {
      await navigator.clipboard.writeText(ticket.suggested_reply);
      toast.success("Suggested reply copied to clipboard");
    } catch {
      toast.error("Could not copy reply");
    }
  };

  return (
    <DashboardLayout title="Ticket Details">
      <div className="space-y-6">
        <Link to="/support" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to tickets
        </Link>

        <Card className="shadow-sm">
          <CardContent className="space-y-3 p-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{ticket.subject}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">{ticket.customer_name}</span>
              <span className="text-border">•</span>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium">{ticket.category}</span>
              <PriorityBadge priority={ticket.priority} />
              <TicketStatusBadge status={ticket.status} />
            </div>
            {ticket.needs_human && (
              <div className="flex items-center gap-2 rounded-lg border border-[var(--hot-border)] bg-[var(--hot-bg)] px-4 py-3 text-sm font-medium text-[var(--hot-fg)]">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                AI flagged this ticket for human review before replying.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Customer Message</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <span className="flex items-center gap-1.5 text-foreground"><User className="h-4 w-4 text-muted-foreground" />{ticket.customer_name}</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Mail className="h-4 w-4" />{ticket.customer_email}</span>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Subject</p>
                  <p className="mt-1 text-sm font-medium">{ticket.subject}</p>
                </div>
                <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm leading-relaxed text-foreground">{ticket.message}</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base font-semibold">Suggested Reply</CardTitle>
                <Button variant="outline" size="sm" onClick={copyReply}><Copy className="mr-1.5 h-3.5 w-3.5" />Copy Reply</Button>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line rounded-lg border border-primary/20 bg-primary/5 p-5 text-sm leading-relaxed text-foreground">
                  {ticket.suggested_reply}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={notWired}>Mark In Progress</Button>
                  <Button variant="outline" onClick={notWired}>Resolve Ticket</Button>
                  <Button variant="ghost" onClick={notWired}>Close Ticket</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="flex-row items-center gap-2 space-y-0 pb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <dl className="grid grid-cols-2 gap-3">
                  <div><dt className="text-xs text-muted-foreground">Category</dt><dd className="mt-1 font-medium">{ticket.category}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Priority</dt><dd className="mt-1"><PriorityBadge priority={ticket.priority} /></dd></div>
                  <div className="col-span-2"><dt className="text-xs text-muted-foreground">Human review</dt><dd className="mt-1"><HumanReviewBadge needs={ticket.needs_human} />{!ticket.needs_human && <span className="ml-1 text-xs text-muted-foreground">Not required</span>}</dd></div>
                </dl>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">AI summary</p>
                  <p className="mt-1.5 leading-relaxed">{ticket.ai_summary}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Ticket Activity</CardTitle></CardHeader>
              <CardContent>
                <ActivityTimeline
                  items={[
                    { label: "Email received", timestamp: fmt(ticket.created_at), done: true },
                    { label: "AI triage completed", timestamp: fmt(ticket.created_at), done: true },
                    { label: "Reply generated", timestamp: fmt(ticket.created_at), done: true },
                    ...(ticket.needs_human ? [{ label: "Human review requested", timestamp: fmt(ticket.created_at), done: true }] : []),
                    { label: "Status updated", timestamp: done ? fmt(ticket.updated_at) : "Pending", done },
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
