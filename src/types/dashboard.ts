import type { LeadCategory, LeadStatus } from "@/types/lead";
import type { SupportCategory, SupportPriority, SupportTicketStatus } from "@/types/supportTicket";

export interface DashboardMetrics {
  totalLeads: number;
  hotLeads: number;
  openSupportTickets: number;
  humanReviewTickets: number;
}

export interface LeadDistributionItem {
  category: LeadCategory;
  count: number;
}

export interface TicketCategoryDistributionItem {
  category: SupportCategory;
  count: number;
}

export interface DashboardSummary {
  hotLeadPercentage: number;
  humanReviewCount: number;
  unresolvedCriticalTickets: number;
  leadsAwaitingContact: number;
}

export interface RecentLead {
  id: string;
  name: string;
  company: string | null;
  lead_score: number | null;
  lead_category: LeadCategory | null;
  status: LeadStatus;
  created_at: string;
}

export interface RecentTicket {
  id: string;
  customer_name: string;
  subject: string;
  priority: SupportPriority | null;
  needs_human: boolean;
  status: SupportTicketStatus;
  created_at: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  leadDistribution: LeadDistributionItem[];
  ticketCategoryDistribution: TicketCategoryDistributionItem[];
  recentLeads: RecentLead[];
  recentTickets: RecentTicket[];
  summary: DashboardSummary;
}
