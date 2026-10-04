import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Inbox, SearchX } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { PriorityBadge, TicketStatusBadge, HumanReviewBadge } from "@/components/common/badges";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { displayText, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SupportTicket } from "@/types/supportTicket";

export const Route = createFileRoute("/_authenticated/support/")({
  head: () => ({
    meta: [
      { title: "Support Tickets — AI Business Operations Dashboard" },
      {
        name: "description",
        content: "AI-triaged support tickets with priority, category, and human review flags.",
      },
    ],
  }),
  component: SupportPage,
});

const PAGE_SIZE = 8;
const EMPTY_TICKETS: SupportTicket[] = [];

function SupportPage() {
  const { data, isLoading, isError, refetch } = useSupportTickets();
  const tickets = data ?? EMPTY_TICKETS;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [review, setReview] = useState("ALL");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      if (
        q &&
        ![t.customer_name, t.subject, t.customer_email].some((v) => v.toLowerCase().includes(q))
      )
        return false;
      if (category !== "ALL" && t.category !== category) return false;
      if (priority !== "ALL" && t.priority !== priority) return false;
      if (status !== "ALL" && t.status !== status) return false;
      if (review === "YES" && !t.needs_human) return false;
      if (review === "NO" && t.needs_human) return false;
      return true;
    });
  }, [tickets, search, category, priority, status, review]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const filter = (
    value: string,
    set: (v: string) => void,
    label: string,
    options: [string, string][],
  ) => (
    <Select
      value={value}
      onValueChange={(v) => {
        set(v);
        setPage(1);
      }}
    >
      <SelectTrigger className="lg:w-36" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(([v, l]) => (
          <SelectItem key={v} value={v}>
            {l}
          </SelectItem>
        ))}
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

        <Card>
          <CardContent className="flex flex-col gap-3 p-3 sm:p-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="Search by customer, subject, or email…"
                aria-label="Search support tickets"
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex">
              {filter(category, setCategory, "Category", [
                ["ALL", "All categories"],
                ["Billing", "Billing"],
                ["Technical", "Technical"],
                ["Sales", "Sales"],
                ["General", "General"],
              ])}
              {filter(priority, setPriority, "Priority", [
                ["ALL", "All priorities"],
                ["Critical", "Critical"],
                ["High", "High"],
                ["Normal", "Normal"],
              ])}
              {filter(status, setStatus, "Status", [
                ["ALL", "All statuses"],
                ["OPEN", "Open"],
                ["IN_PROGRESS", "In progress"],
                ["WAITING_CUSTOMER", "Waiting on customer"],
                ["RESOLVED", "Resolved"],
                ["CLOSED", "Closed"],
              ])}
              {filter(review, setReview, "Human review", [
                ["ALL", "Any review"],
                ["YES", "Needs human"],
                ["NO", "AI handled"],
              ])}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0 sm:p-0">
            {isLoading ? (
              <TableSkeleton />
            ) : isError ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <h3 className="text-sm font-semibold text-foreground">
                  Unable to load support tickets
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Something went wrong while loading support tickets. Please try again.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    void refetch();
                  }}
                >
                  Retry
                </Button>
              </div>
            ) : tickets.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="No support tickets found"
                description="Incoming support emails will be triaged by AI and appear here."
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No tickets match your filters"
                description="Try adjusting the search text or clearing a filter."
              />
            ) : (
              <Table className="min-w-[1000px]">
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
                    <TableRow
                      key={t.id}
                      className={cn(
                        t.needs_human &&
                          "bg-warning-soft/50 shadow-[inset_3px_0_0_var(--warning)] hover:bg-warning-soft",
                      )}
                    >
                      <TableCell className="pl-6">
                        <p className="font-medium text-foreground">{t.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{t.customer_email}</p>
                      </TableCell>
                      <TableCell className="max-w-64">
                        <p className="truncate text-foreground">{t.subject}</p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {displayText(t.category)}
                      </TableCell>
                      <TableCell>
                        {t.priority ? (
                          <PriorityBadge priority={t.priority} />
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <HumanReviewBadge needs={t.needs_human} />
                      </TableCell>
                      <TableCell>
                        <TicketStatusBadge status={t.status} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(t.created_at)}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link
                            to="/support/$ticketId"
                            params={{ ticketId: t.id }}
                            aria-label={`View ticket from ${t.customer_name}`}
                          >
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {!isLoading && !isError && filtered.length > PAGE_SIZE && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === currentPage}
                    onClick={() => setPage(p)}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  className={
                    currentPage === pageCount ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </DashboardLayout>
  );
}
