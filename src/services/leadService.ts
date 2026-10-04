import { supabase } from "@/lib/supabase";
import { LEAD_STATUSES, type Lead, type LeadCategory, type LeadStatus } from "@/types/lead";

export class LeadNotFoundError extends Error {
  constructor() {
    super("Lead not found.");
    this.name = "LeadNotFoundError";
  }
}

const LEAD_COLUMNS =
  "id, name, email, phone, company, service_required, budget, timeline, message, lead_score, lead_category, ai_summary, recommended_action, status, source, created_at, updated_at";

const LEAD_CATEGORIES: readonly LeadCategory[] = ["HOT", "WARM", "COLD"];

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to load leads.");
  }

  return parseLeads(data);
}

export async function getLeadById(id: string): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to load lead.");
  }

  if (data === null) {
    throw new LeadNotFoundError();
  }

  return parseSingleLead(data, "Failed to load lead.");
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .select(LEAD_COLUMNS)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to update lead status.");
  }

  if (data === null) {
    throw new LeadNotFoundError();
  }

  return parseSingleLead(data, "Failed to update lead status.");
}

function parseSingleLead(value: unknown, failureMessage: string): Lead {
  try {
    return parseLead(value);
  } catch {
    throw new Error(failureMessage);
  }
}

function parseLeads(data: unknown): Lead[] {
  if (!Array.isArray(data)) {
    throw new Error("Failed to load leads.");
  }

  return data.map(parseLead);
}

function parseLead(value: unknown): Lead {
  if (!isRecord(value)) {
    throw new Error("Failed to load leads.");
  }

  return {
    id: readRequiredString(value["id"]),
    name: readRequiredString(value["name"]),
    email: readRequiredString(value["email"]),
    phone: readNullableString(value["phone"]),
    company: readNullableString(value["company"]),
    service_required: readNullableString(value["service_required"]),
    budget: readNullableString(value["budget"]),
    timeline: readNullableString(value["timeline"]),
    message: readNullableString(value["message"]),
    lead_score: readNullableScore(value["lead_score"]),
    lead_category: readNullableCategory(value["lead_category"]),
    ai_summary: readNullableString(value["ai_summary"]),
    recommended_action: readNullableString(value["recommended_action"]),
    status: readStatus(value["status"]),
    source: readNullableString(value["source"]),
    created_at: readRequiredString(value["created_at"]),
    updated_at: readRequiredString(value["updated_at"]),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readRequiredString(value: unknown): string {
  if (typeof value === "string") return value;
  throw new Error("Failed to load leads.");
}

function readNullableString(value: unknown): string | null {
  if (value === null) return null;
  if (typeof value === "string") return value;
  throw new Error("Failed to load leads.");
}

function readNullableScore(value: unknown): number | null {
  if (value === null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const score = Number(value);
    if (Number.isFinite(score)) return score;
  }
  throw new Error("Failed to load leads.");
}

function readNullableCategory(value: unknown): LeadCategory | null {
  if (value === null) return null;
  if (isLeadCategory(value)) return value;
  throw new Error("Failed to load leads.");
}

function readStatus(value: unknown): LeadStatus {
  if (isLeadStatus(value)) return value;
  throw new Error("Failed to load leads.");
}

function isLeadCategory(value: unknown): value is LeadCategory {
  return typeof value === "string" && LEAD_CATEGORIES.some((category) => category === value);
}

function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && LEAD_STATUSES.some((status) => status === value);
}
