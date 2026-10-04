import { describe, expect, it, vi } from "vitest";

import { buildDashboardData } from "@/services/dashboardService";
import type { Lead, LeadCategory, LeadStatus } from "@/types/lead";
import type {
  SupportCategory,
  SupportPriority,
  SupportTicket,
  SupportTicketStatus,
} from "@/types/supportTicket";

vi.mock("@/lib/supabase", () => ({
  supabase: {},
}));

function createLead(options: {
  id: string;
  category: LeadCategory | null;
  status: LeadStatus;
  createdAt: string;
  name?: string;
  company?: string | null;
  score?: number | null;
}): Lead {
  return {
    id: options.id,
    name: options.name ?? options.id,
    email: `${options.id}@example.com`,
    phone: null,
    company: options.company === undefined ? "Example Co" : options.company,
    service_required: null,
    budget: null,
    timeline: null,
    message: null,
    lead_score: options.score === undefined ? 8 : options.score,
    lead_category: options.category,
    ai_summary: null,
    recommended_action: null,
    status: options.status,
    source: null,
    created_at: options.createdAt,
    updated_at: options.createdAt,
  };
}

function createTicket(options: {
  id: string;
  category: SupportCategory | null;
  priority: SupportPriority | null;
  status: SupportTicketStatus;
  needsHuman: boolean;
  createdAt: string;
  subject?: string;
}): SupportTicket {
  return {
    id: options.id,
    customer_name: options.id,
    customer_email: `${options.id}@example.com`,
    subject: options.subject ?? options.id,
    message: null,
    category: options.category,
    priority: options.priority,
    ai_summary: null,
    needs_human: options.needsHuman,
    suggested_reply: null,
    status: options.status,
    source: null,
    gmail_message_id: null,
    created_at: options.createdAt,
    updated_at: options.createdAt,
  };
}

describe("buildDashboardData", () => {
  it("calculates overview metrics from leads and tickets", () => {
    const leads = [
      createLead({ id: "l1", category: "HOT", status: "NEW", createdAt: "2026-10-01T00:00:00Z" }),
      createLead({
        id: "l2",
        category: "HOT",
        status: "CONTACTED",
        createdAt: "2026-10-02T00:00:00Z",
      }),
      createLead({ id: "l3", category: "WARM", status: "NEW", createdAt: "2026-10-03T00:00:00Z" }),
      createLead({
        id: "l4",
        category: "WARM",
        status: "QUALIFIED",
        createdAt: "2026-10-04T00:00:00Z",
      }),
      createLead({ id: "l5", category: "COLD", status: "LOST", createdAt: "2026-10-05T00:00:00Z" }),
    ];
    const tickets = [
      createTicket({
        id: "t1",
        category: "Billing",
        priority: "Critical",
        status: "OPEN",
        needsHuman: true,
        createdAt: "2026-10-01T00:00:00Z",
      }),
      createTicket({
        id: "t2",
        category: "Technical",
        priority: "High",
        status: "IN_PROGRESS",
        needsHuman: true,
        createdAt: "2026-10-02T00:00:00Z",
      }),
      createTicket({
        id: "t3",
        category: "Technical",
        priority: "Normal",
        status: "WAITING_CUSTOMER",
        needsHuman: false,
        createdAt: "2026-10-03T00:00:00Z",
      }),
      createTicket({
        id: "t4",
        category: "Sales",
        priority: "Critical",
        status: "RESOLVED",
        needsHuman: false,
        createdAt: "2026-10-04T00:00:00Z",
      }),
      createTicket({
        id: "t5",
        category: "General",
        priority: "Critical",
        status: "CLOSED",
        needsHuman: false,
        createdAt: "2026-10-05T00:00:00Z",
      }),
    ];

    const dashboard = buildDashboardData(leads, tickets);

    expect(dashboard.metrics).toEqual({
      totalLeads: 5,
      hotLeads: 2,
      openSupportTickets: 2,
      humanReviewTickets: 2,
    });
    expect(dashboard.leadDistribution).toEqual([
      { category: "HOT", count: 2 },
      { category: "WARM", count: 2 },
      { category: "COLD", count: 1 },
    ]);
    expect(dashboard.ticketCategoryDistribution).toEqual([
      { category: "Billing", count: 1 },
      { category: "Technical", count: 2 },
      { category: "Sales", count: 1 },
      { category: "General", count: 1 },
    ]);
    expect(dashboard.summary).toEqual({
      hotLeadPercentage: 40,
      humanReviewCount: 2,
      unresolvedCriticalTickets: 1,
      leadsAwaitingContact: 2,
    });
    expect(dashboard.recentLeads.map((lead) => lead.id)).toEqual(["l5", "l4", "l3", "l2", "l1"]);
    expect(dashboard.recentTickets.map((ticket) => ticket.id)).toEqual([
      "t5",
      "t4",
      "t3",
      "t2",
      "t1",
    ]);
  });

  it("keeps zero counts and avoids dividing by zero when both datasets are empty", () => {
    const dashboard = buildDashboardData([], []);

    expect(dashboard.metrics).toEqual({
      totalLeads: 0,
      hotLeads: 0,
      openSupportTickets: 0,
      humanReviewTickets: 0,
    });
    expect(dashboard.leadDistribution).toEqual([
      { category: "HOT", count: 0 },
      { category: "WARM", count: 0 },
      { category: "COLD", count: 0 },
    ]);
    expect(dashboard.ticketCategoryDistribution).toEqual([
      { category: "Billing", count: 0 },
      { category: "Technical", count: 0 },
      { category: "Sales", count: 0 },
      { category: "General", count: 0 },
    ]);
    expect(dashboard.summary).toEqual({
      hotLeadPercentage: 0,
      humanReviewCount: 0,
      unresolvedCriticalTickets: 0,
      leadsAwaitingContact: 0,
    });
    expect(dashboard.recentLeads).toEqual([]);
    expect(dashboard.recentTickets).toEqual([]);
  });

  it("counts only open and in-progress tickets, and only unresolved critical tickets", () => {
    const tickets = [
      createTicket({
        id: "open",
        category: "Billing",
        priority: "Critical",
        status: "OPEN",
        needsHuman: false,
        createdAt: "2026-10-01T00:00:00Z",
      }),
      createTicket({
        id: "progress",
        category: "Sales",
        priority: "High",
        status: "IN_PROGRESS",
        needsHuman: false,
        createdAt: "2026-10-02T00:00:00Z",
      }),
      createTicket({
        id: "waiting",
        category: "General",
        priority: "Critical",
        status: "WAITING_CUSTOMER",
        needsHuman: true,
        createdAt: "2026-10-03T00:00:00Z",
      }),
      createTicket({
        id: "resolved",
        category: "Technical",
        priority: "Critical",
        status: "RESOLVED",
        needsHuman: true,
        createdAt: "2026-10-04T00:00:00Z",
      }),
      createTicket({
        id: "closed",
        category: null,
        priority: "Critical",
        status: "CLOSED",
        needsHuman: false,
        createdAt: "2026-10-05T00:00:00Z",
      }),
    ];

    const dashboard = buildDashboardData([], tickets);

    expect(dashboard.metrics.openSupportTickets).toBe(2);
    expect(dashboard.metrics.humanReviewTickets).toBe(2);
    expect(dashboard.summary.unresolvedCriticalTickets).toBe(2);
    expect(
      dashboard.ticketCategoryDistribution.find((item) => item.category === "Technical")?.count,
    ).toBe(1);
  });

  it("returns the five newest records and ignores uncategorized leads in distribution", () => {
    const leads = [
      createLead({
        id: "old",
        category: null,
        status: "NEW",
        createdAt: "2026-09-01T00:00:00Z",
        company: null,
        score: null,
      }),
      createLead({ id: "a", category: "COLD", status: "NEW", createdAt: "2026-10-01T00:00:00Z" }),
      createLead({
        id: "b",
        category: "WARM",
        status: "CONTACTED",
        createdAt: "2026-10-02T00:00:00Z",
      }),
      createLead({ id: "c", category: "HOT", status: "NEW", createdAt: "2026-10-03T00:00:00Z" }),
      createLead({ id: "d", category: "HOT", status: "LOST", createdAt: "2026-10-04T00:00:00Z" }),
      createLead({
        id: "e",
        category: "WARM",
        status: "QUALIFIED",
        createdAt: "2026-10-05T00:00:00Z",
      }),
    ];

    const dashboard = buildDashboardData(leads, []);

    expect(dashboard.metrics.totalLeads).toBe(6);
    expect(dashboard.metrics.hotLeads).toBe(2);
    expect(dashboard.summary.hotLeadPercentage).toBe(33);
    expect(dashboard.summary.leadsAwaitingContact).toBe(3);
    expect(dashboard.leadDistribution).toEqual([
      { category: "HOT", count: 2 },
      { category: "WARM", count: 2 },
      { category: "COLD", count: 1 },
    ]);
    expect(dashboard.recentLeads).toHaveLength(5);
    expect(dashboard.recentLeads[0]?.id).toBe("e");
    expect(dashboard.recentLeads.at(-1)?.id).toBe("a");
    expect(dashboard.recentLeads.some((lead) => lead.id === "old")).toBe(false);
  });
});
