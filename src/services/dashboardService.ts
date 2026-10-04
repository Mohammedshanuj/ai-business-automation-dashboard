import { getLeads } from "@/services/leadService";
import { getSupportTickets } from "@/services/supportTicketService";
import type {
  DashboardData,
  DashboardMetrics,
  DashboardSummary,
  LeadDistributionItem,
  RecentLead,
  RecentTicket,
  TicketCategoryDistributionItem,
} from "@/types/dashboard";
import type { Lead, LeadCategory } from "@/types/lead";
import {
  SUPPORT_CATEGORIES,
  type SupportTicket,
  type SupportTicketStatus,
} from "@/types/supportTicket";

const DASHBOARD_LOAD_ERROR = "Failed to load dashboard.";
const RECENT_LIMIT = 5;

const LEAD_DISTRIBUTION_CATEGORIES = [
  "HOT",
  "WARM",
  "COLD",
] as const satisfies readonly LeadCategory[];
const OPEN_SUPPORT_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
] as const satisfies readonly SupportTicketStatus[];
const CLOSED_SUPPORT_STATUSES = [
  "RESOLVED",
  "CLOSED",
] as const satisfies readonly SupportTicketStatus[];

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const [leads, tickets] = await Promise.all([getLeads(), getSupportTickets()]);
    return buildDashboardData(leads, tickets);
  } catch {
    throw new Error(DASHBOARD_LOAD_ERROR);
  }
}

export function buildDashboardData(
  leads: readonly Lead[],
  tickets: readonly SupportTicket[],
): DashboardData {
  const metrics = buildMetrics(leads, tickets);

  return {
    metrics,
    leadDistribution: buildLeadDistribution(leads),
    ticketCategoryDistribution: buildTicketCategoryDistribution(tickets),
    recentLeads: latestByCreatedAt(leads, RECENT_LIMIT).map(toRecentLead),
    recentTickets: latestByCreatedAt(tickets, RECENT_LIMIT).map(toRecentTicket),
    summary: buildSummary(leads, tickets, metrics),
  };
}

function buildMetrics(leads: readonly Lead[], tickets: readonly SupportTicket[]): DashboardMetrics {
  return {
    totalLeads: leads.length,
    hotLeads: leads.filter((lead) => lead.lead_category === "HOT").length,
    openSupportTickets: tickets.filter((ticket) => isOpenSupportTicket(ticket.status)).length,
    humanReviewTickets: tickets.filter((ticket) => ticket.needs_human).length,
  };
}

function buildSummary(
  leads: readonly Lead[],
  tickets: readonly SupportTicket[],
  metrics: DashboardMetrics,
): DashboardSummary {
  return {
    hotLeadPercentage: hotLeadPercentage(metrics.hotLeads, metrics.totalLeads),
    humanReviewCount: metrics.humanReviewTickets,
    unresolvedCriticalTickets: tickets.filter(isUnresolvedCriticalTicket).length,
    leadsAwaitingContact: leads.filter((lead) => lead.status === "NEW").length,
  };
}

function buildLeadDistribution(leads: readonly Lead[]): LeadDistributionItem[] {
  return LEAD_DISTRIBUTION_CATEGORIES.map((category) => ({
    category,
    count: leads.filter((lead) => lead.lead_category === category).length,
  }));
}

function buildTicketCategoryDistribution(
  tickets: readonly SupportTicket[],
): TicketCategoryDistributionItem[] {
  return SUPPORT_CATEGORIES.map((category) => ({
    category,
    count: tickets.filter((ticket) => ticket.category === category).length,
  }));
}

function hotLeadPercentage(hotLeads: number, totalLeads: number): number {
  if (totalLeads <= 0) return 0;
  return Math.round((hotLeads / totalLeads) * 100);
}

function isOpenSupportTicket(status: SupportTicketStatus): boolean {
  return OPEN_SUPPORT_STATUSES.some((openStatus) => openStatus === status);
}

function isUnresolvedCriticalTicket(ticket: SupportTicket): boolean {
  return ticket.priority === "Critical" && !isClosedSupportTicket(ticket.status);
}

function isClosedSupportTicket(status: SupportTicketStatus): boolean {
  return CLOSED_SUPPORT_STATUSES.some((closedStatus) => closedStatus === status);
}

function latestByCreatedAt<T extends { created_at: string }>(
  items: readonly T[],
  limit: number,
): T[] {
  return [...items]
    .sort((left, right) => right.created_at.localeCompare(left.created_at))
    .slice(0, limit);
}

function toRecentLead(lead: Lead): RecentLead {
  return {
    id: lead.id,
    name: lead.name,
    company: lead.company,
    lead_score: lead.lead_score,
    lead_category: lead.lead_category,
    status: lead.status,
    created_at: lead.created_at,
  };
}

function toRecentTicket(ticket: SupportTicket): RecentTicket {
  return {
    id: ticket.id,
    customer_name: ticket.customer_name,
    subject: ticket.subject,
    priority: ticket.priority,
    needs_human: ticket.needs_human,
    status: ticket.status,
    created_at: ticket.created_at,
  };
}
