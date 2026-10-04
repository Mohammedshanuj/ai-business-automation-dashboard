export type LeadCategory = "HOT" | "WARM" | "COLD";

export const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_required: string | null;
  budget: string | null;
  timeline: string | null;
  message: string | null;
  lead_score: number | null;
  lead_category: LeadCategory | null;
  ai_summary: string | null;
  recommended_action: string | null;
  status: LeadStatus;
  source: string | null;
  created_at: string;
  updated_at: string;
}
