export const SUPPORT_CATEGORIES = ["Billing", "Technical", "Sales", "General"] as const;

export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number];

export const SUPPORT_PRIORITIES = ["Critical", "High", "Normal"] as const;

export type SupportPriority = (typeof SUPPORT_PRIORITIES)[number];

export const SUPPORT_TICKET_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_CUSTOMER",
  "RESOLVED",
  "CLOSED",
] as const;

export type SupportTicketStatus = (typeof SUPPORT_TICKET_STATUSES)[number];

export interface SupportTicket {
  id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  message: string | null;
  category: SupportCategory | null;
  priority: SupportPriority | null;
  ai_summary: string | null;
  needs_human: boolean;
  suggested_reply: string | null;
  status: SupportTicketStatus;
  source: string | null;
  gmail_message_id: string | null;
  created_at: string;
  updated_at: string;
}
