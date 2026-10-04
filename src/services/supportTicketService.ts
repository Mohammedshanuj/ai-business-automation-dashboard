import { supabase } from "@/lib/supabase";
import {
  SUPPORT_CATEGORIES,
  SUPPORT_PRIORITIES,
  SUPPORT_TICKET_STATUSES,
  type SupportTicket,
  type SupportTicketStatus,
} from "@/types/supportTicket";

export class SupportTicketNotFoundError extends Error {
  constructor() {
    super("Support ticket not found.");
    this.name = "SupportTicketNotFoundError";
  }
}

const LOAD_ERROR_MESSAGE = "Failed to load support tickets.";
const LOAD_ONE_ERROR_MESSAGE = "Failed to load support ticket.";
const UPDATE_STATUS_ERROR_MESSAGE = "Failed to update support ticket status.";

const SUPPORT_TICKET_COLUMNS =
  "id, customer_name, customer_email, subject, message, category, priority, ai_summary, needs_human, suggested_reply, status, source, gmail_message_id, created_at, updated_at";

export async function getSupportTickets(): Promise<SupportTicket[]> {
  const { data, error } = await supabase
    .from("support_tickets")
    .select(SUPPORT_TICKET_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(LOAD_ERROR_MESSAGE);
  }

  return parseSupportTickets(data);
}

export async function getSupportTicketById(id: string): Promise<SupportTicket> {
  const { data, error } = await supabase
    .from("support_tickets")
    .select(SUPPORT_TICKET_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(LOAD_ONE_ERROR_MESSAGE);
  }

  if (data === null) {
    throw new SupportTicketNotFoundError();
  }

  return parseSingleSupportTicket(data, LOAD_ONE_ERROR_MESSAGE);
}

export async function updateSupportTicketStatus(
  id: string,
  status: SupportTicketStatus,
): Promise<SupportTicket> {
  const { data, error } = await supabase
    .from("support_tickets")
    .update({ status })
    .eq("id", id)
    .select(SUPPORT_TICKET_COLUMNS)
    .maybeSingle();

  if (error) {
    throw new Error(UPDATE_STATUS_ERROR_MESSAGE);
  }

  if (data === null) {
    throw new SupportTicketNotFoundError();
  }

  return parseSingleSupportTicket(data, UPDATE_STATUS_ERROR_MESSAGE);
}

function parseSingleSupportTicket(value: unknown, failureMessage: string): SupportTicket {
  try {
    return parseSupportTicket(value);
  } catch {
    throw new Error(failureMessage);
  }
}

function parseSupportTickets(data: unknown): SupportTicket[] {
  if (!Array.isArray(data)) {
    throw new Error(LOAD_ERROR_MESSAGE);
  }

  return data.map(parseSupportTicket);
}

function parseSupportTicket(value: unknown): SupportTicket {
  if (!isRecord(value)) {
    throw new Error(LOAD_ERROR_MESSAGE);
  }

  return {
    id: readRequiredString(value["id"]),
    customer_name: readRequiredString(value["customer_name"]),
    customer_email: readRequiredString(value["customer_email"]),
    subject: readRequiredString(value["subject"]),
    message: readNullableString(value["message"]),
    category: readNullableEnum(value["category"], SUPPORT_CATEGORIES),
    priority: readNullableEnum(value["priority"], SUPPORT_PRIORITIES),
    ai_summary: readNullableString(value["ai_summary"]),
    needs_human: readBoolean(value["needs_human"]),
    suggested_reply: readNullableString(value["suggested_reply"]),
    status: readStatus(value["status"]),
    source: readNullableString(value["source"]),
    gmail_message_id: readNullableString(value["gmail_message_id"]),
    created_at: readRequiredString(value["created_at"]),
    updated_at: readRequiredString(value["updated_at"]),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readRequiredString(value: unknown): string {
  if (typeof value === "string") return value;
  throw new Error(LOAD_ERROR_MESSAGE);
}

function readNullableString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  throw new Error(LOAD_ERROR_MESSAGE);
}

function readBoolean(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "boolean") return value;
  throw new Error(LOAD_ERROR_MESSAGE);
}

function readNullableEnum<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  if (value === null || value === undefined) return null;
  if (isOneOf(value, allowed)) return value;
  throw new Error(LOAD_ERROR_MESSAGE);
}

function readStatus(value: unknown): SupportTicketStatus {
  if (isOneOf(value, SUPPORT_TICKET_STATUSES)) return value;
  throw new Error(LOAD_ERROR_MESSAGE);
}

function isOneOf<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === "string" && allowed.some((option) => option === value);
}
