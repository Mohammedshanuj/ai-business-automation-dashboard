import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Inbox, SearchX } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { PriorityBadge, TicketStatusBadge, HumanReviewBadge } from "@/components/common/badges";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { tickets } from "@/data/mock";

export const Route = createFileRoute("/support/")({
  head: () => ({
    meta: [
      { title: "Support Tickets — AI Business Operations Dashboard" },
      { name: "description", content: "AI-triaged support tickets with priority, category, and human review flags." },
    ],
  }),
  component: SupportPage,
});

const PAGE_SIZE = 8;

function SupportPage() {
  const loading = useSimulatedLoading();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [review, setReview] = useState("ALL");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      if (q && ![t.customer_name, t.subject, t.customer_email].some((v) => v.toLowerCase().includes(q))) return false;
      if (category !== "ALL" && t.category !== category) return false;
      if (priority !== "ALL" && t.priority !== priority) return false;
      if (status !== "ALL" && t.status !== status) return false;
      if (review === "YES" && !t.needs_human) return false;
      if (review === "NO" && t.needs_human) return false;
      return true;
    });
  }, [search, category, priority, status, review]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const filter = (
    value: string,
    set: (v: string) => void,
    label: string,
    options: [string, string][]
  ) => (
    <Select value={value} onValueChange={(v) => { set(v); setPage(1); }}>
      <SelectTrigger className="lg:w-36" aria-label={label}><SelectValue /></SelectTrigger>
      <SelectContent>
        {options.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
      </SelectContent>
    </Select>
  );

  return (
    <DashboardLayout title="Support Tickets">
      <div className="space-y-6">
        <PageHeader
          title="Support Tickets"
          subtitle="Inbound emails triaged by AI with suggested replies and human-in-the-loop review."
        />

        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by customer, subject, or email…"
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex">
              {filter(category, setCategory, "Category", [["ALL", "All categories"], ["Billing", "Billing"], ["Technical", "Technical"], ["Sales", "Sales"], ["General", "General"]])}
              {filter(priority, setPriority, "Priority", [["ALL", "All priorities"], ["Critical", "Critical"], ["High", "High"], ["Normal", "Normal"]])}
              {filter(status, setStatus, "Status", [["ALL", "All statuses"], ["OPEN", "Open"], ["IN_PROGRESS", "In progress"], ["WAITING_CUSTOMER", "Waiting customer"], ["RESOLVED", "Resolved"], ["CLOSED", "Closed"]])}
              {filter(review, setReview, "Human review", [["ALL", "Any review"], ["YES", "Needs human"], ["NO", "AI handled"]])}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            {loading ? (
              <TableSkeleton />
            ) : tickets.length === 0 ? (
              <EmptyState icon={Inbox} title="No tickets yet" description="Incoming support emails will be triaged by AI and appear here." />
            ) : filtered.length === 0 ? (
              <EmptyState icon={SearchX} title="No tickets match your filters" description="Try adjusting the search text or clearing a filter." />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Customer</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Human Review</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="pr-6 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((t) => (
                      <TableRow key={t.id} className={cn(t.needs_human && "bg-[var(--hot-bg)]/40")}>
                        <TableCell className="pl-6">
                          <p className="font-medium text-foreground">{t.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{t.customer_email}</p>
                        </TableCell>
                        <TableCell className="max-w-64"><p className="truncate">{t.subject}</p></TableCell>
                        <TableCell className="text-muted-foreground">{t.category}</TableCell>
                        <TableCell><PriorityBadge priority={t.priority} /></TableCell>
                        <TableCell><HumanReviewBadge needs={t.needs_human} /></TableCell>
                        <TableCell><TicketStatusBadge status={t.status} /></TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link to="/support/$ticketId" params={{ ticketId: t.id }}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {!loading && filtered.length > PAGE_SIZE && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
              </PaginationItem>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink isActive={p === currentPage} onClick={() => setPage(p)} className="cursor-pointer">{p}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={() => setPage((p) => Math.min(pageCount, p + 1))} className={currentPage === pageCount ? "pointer-events-none opacity-50" : "cursor-pointer"} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </DashboardLayout>
  );
}
