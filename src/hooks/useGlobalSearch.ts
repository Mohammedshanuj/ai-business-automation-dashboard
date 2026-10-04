import { useEffect, useMemo, useState } from "react";

import { useLeads } from "@/hooks/useLeads";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import type { Lead } from "@/types/lead";
import type { SupportTicket } from "@/types/supportTicket";

export const MIN_SEARCH_LENGTH = 2;
const MAX_RESULTS_PER_GROUP = 5;
const DEBOUNCE_MS = 200;

export type SearchResult =
  | { kind: "lead"; id: string; title: string; subtitle: string }
  | { kind: "ticket"; id: string; title: string; subtitle: string };

interface GlobalSearchState {
  isActive: boolean;
  isLoading: boolean;
  isError: boolean;
  leads: SearchResult[];
  tickets: SearchResult[];
}

export function useGlobalSearch(rawQuery: string): GlobalSearchState {
  const normalized = rawQuery.trim().toLowerCase();
  const query = useDebouncedValue(normalized, DEBOUNCE_MS);
  const isActive = normalized.length >= MIN_SEARCH_LENGTH;
  const isDebouncing = normalized !== query;

  const leadsQuery = useLeads({ enabled: isActive });
  const ticketsQuery = useSupportTickets();

  const leads = useMemo(
    () => (isActive && query.length >= MIN_SEARCH_LENGTH ? matchLeads(leadsQuery.data, query) : []),
    [isActive, query, leadsQuery.data],
  );
  const tickets = useMemo(
    () =>
      isActive && query.length >= MIN_SEARCH_LENGTH ? matchTickets(ticketsQuery.data, query) : [],
    [isActive, query, ticketsQuery.data],
  );

  return {
    isActive,
    isLoading: isActive && (isDebouncing || leadsQuery.isLoading || ticketsQuery.isLoading),
    isError: leadsQuery.isError && ticketsQuery.isError,
    leads,
    tickets,
  };
}

function matchLeads(leads: Lead[] | undefined, query: string): SearchResult[] {
  if (!leads) return [];
  return leads
    .filter((lead) => includesQuery([lead.name, lead.company, lead.email], query))
    .slice(0, MAX_RESULTS_PER_GROUP)
    .map((lead) => ({
      kind: "lead",
      id: lead.id,
      title: lead.name,
      subtitle: lead.company ? `${lead.company} · ${lead.email}` : lead.email,
    }));
}

function matchTickets(tickets: SupportTicket[] | undefined, query: string): SearchResult[] {
  if (!tickets) return [];
  return tickets
    .filter((ticket) =>
      includesQuery([ticket.customer_name, ticket.subject, ticket.customer_email], query),
    )
    .slice(0, MAX_RESULTS_PER_GROUP)
    .map((ticket) => ({
      kind: "ticket",
      id: ticket.id,
      title: ticket.subject,
      subtitle: `${ticket.customer_name} · ${ticket.customer_email}`,
    }));
}

function includesQuery(values: (string | null)[], query: string): boolean {
  return values.some((value) => value?.toLowerCase().includes(query) ?? false);
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
