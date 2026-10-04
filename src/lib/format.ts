import type { LeadStatus } from "@/types/lead";
import type { SupportTicketStatus } from "@/types/supportTicket";

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

const DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {
  ...DATE_FORMAT,
  hour: "numeric",
  minute: "2-digit",
};

const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  CONVERTED: "Converted",
  LOST: "Lost",
};

const TICKET_STATUS_LABELS: Record<SupportTicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  WAITING_CUSTOMER: "Waiting on customer",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", DATE_FORMAT);
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", DATE_TIME_FORMAT);
}

export function displayText(value: string | null | undefined): string {
  if (value === null || value === undefined || value.trim() === "") return "—";
  return value;
}

export function formatLeadStatus(status: LeadStatus): string {
  return LEAD_STATUS_LABELS[status];
}

export function formatTicketStatus(status: SupportTicketStatus): string {
  return TICKET_STATUS_LABELS[status];
}
