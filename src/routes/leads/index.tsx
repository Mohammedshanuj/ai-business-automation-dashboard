import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Users, SearchX } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { LeadCategoryBadge, LeadStatusBadge } from "@/components/common/badges";
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
import { leads, type LeadCategory, type LeadStatus } from "@/data/mock";

export const Route = createFileRoute("/leads/")({
  head: () => ({
    meta: [
      { title: "Leads — AI Business Operations Dashboard" },
      {
        name: "description",
        content: "AI-qualified leads with scores, categories, and recommended actions.",
      },
    ],
  }),
  component: LeadsPage,
});

const PAGE_SIZE = 8;

function LeadsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<LeadCategory | "ALL">("ALL");
  const [status, setStatus] = useState<LeadStatus | "ALL">("ALL");
  const [minScore, setMinScore] = useState("0");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (q && ![l.name, l.company, l.email].some((v) => v.toLowerCase().includes(q)))
        return false;
      if (category !== "ALL" && l.lead_category !== category) return false;
      if (status !== "ALL" && l.status !== status) return false;
      if (l.lead_score < Number(minScore)) return false;
      return true;
    });
  }, [search, category, status, minScore]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <DashboardLayout title="Leads">
      <div className="space-y-6">
        <PageHeader
          title="Leads"
          subtitle="Leads automatically qualified and scored by AI from inbound enquiries."
        />

        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, company, or email…"
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetPage();
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 lg:flex">
              <Select
                value={category}
                onValueChange={(v) => {
                  setCategory(v as LeadCategory | "ALL");
                  resetPage();
                }}
              >
                <SelectTrigger className="lg:w-32" aria-label="Filter by category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All categories</SelectItem>
                  <SelectItem value="HOT">HOT</SelectItem>
                  <SelectItem value="WARM">WARM</SelectItem>
                  <SelectItem value="COLD">COLD</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v as LeadStatus | "ALL");
                  resetPage();
                }}
              >
                <SelectTrigger className="lg:w-36" aria-label="Filter by status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="QUALIFIED">Qualified</SelectItem>
                  <SelectItem value="CONVERTED">Converted</SelectItem>
                  <SelectItem value="LOST">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={minScore}
                onValueChange={(v) => {
                  setMinScore(v);
                  resetPage();
                }}
              >
                <SelectTrigger className="lg:w-32" aria-label="Filter by minimum score">
                  <SelectValue placeholder="Min score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any score</SelectItem>
                  <SelectItem value="50">Score 50+</SelectItem>
                  <SelectItem value="70">Score 70+</SelectItem>
                  <SelectItem value="85">Score 85+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-0 py-0">
            {leads.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No leads yet"
                description="When new enquiries arrive, the AI qualification pipeline will score and list them here."
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No leads match your filters"
                description="Try adjusting the search text or clearing one of the filters."
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Lead</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recommended Action</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="pr-6 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="pl-6">
                          <p className="font-medium text-foreground">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.email}</p>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{lead.company}</TableCell>
                        <TableCell>
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold tabular-nums text-primary">
                            {lead.lead_score}
                          </span>
                        </TableCell>
                        <TableCell>
                          <LeadCategoryBadge category={lead.lead_category} />
                        </TableCell>
                        <TableCell>
                          <LeadStatusBadge status={lead.status} />
                        </TableCell>
                        <TableCell className="max-w-56">
                          <p className="truncate text-sm text-muted-foreground" title={lead.recommended_action}>
                            {lead.recommended_action}
                          </p>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link to="/leads/$leadId" params={{ leadId: lead.id }}>
                              View
                            </Link>
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

        {filtered.length > PAGE_SIZE && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                  aria-disabled={currentPage === pageCount}
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
