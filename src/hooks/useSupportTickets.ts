import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardQueryKey } from "@/hooks/useDashboard";
import {
  getSupportTicketById,
  getSupportTickets,
  SupportTicketNotFoundError,
  updateSupportTicketStatus,
} from "@/services/supportTicketService";
import {
  SUPPORT_PRIORITIES,
  type SupportPriority,
  type SupportTicket,
  type SupportTicketStatus,
} from "@/types/supportTicket";

export function useSupportTickets() {
  const query = useQuery({
    queryKey: ["support-tickets"],
    queryFn: getSupportTickets,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

const RESOLVED_STATUSES: readonly SupportTicketStatus[] = ["RESOLVED", "CLOSED"];
const PRIORITY_RANK: Record<SupportPriority, number> = { Critical: 0, High: 1, Normal: 2 };

export function needsHumanAttention(ticket: SupportTicket): boolean {
  return ticket.needs_human && !RESOLVED_STATUSES.includes(ticket.status);
}

function selectTicketsNeedingAttention(tickets: SupportTicket[]): SupportTicket[] {
  const rank = (ticket: SupportTicket) =>
    ticket.priority ? PRIORITY_RANK[ticket.priority] : SUPPORT_PRIORITIES.length;
  return tickets.filter(needsHumanAttention).sort((a, b) => rank(a) - rank(b));
}

/** Open tickets flagged for human review, most urgent first (then newest first). */
export function useTicketsNeedingAttention() {
  const query = useQuery({
    queryKey: ["support-tickets"],
    queryFn: getSupportTickets,
    select: selectTicketsNeedingAttention,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useSupportTicket(id: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["support-ticket", id],
    queryFn: () => getSupportTicketById(id),
    initialData: () =>
      queryClient
        .getQueryData<SupportTicket[]>(["support-tickets"])
        ?.find((ticket) => ticket.id === id),
    retry: (failureCount, error) =>
      !(error instanceof SupportTicketNotFoundError) && failureCount < 2,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isNotFound: query.error instanceof SupportTicketNotFoundError,
    refetch: query.refetch,
  };
}

export function useUpdateSupportTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SupportTicketStatus }) =>
      updateSupportTicketStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["support-ticket", id] });
      await queryClient.cancelQueries({ queryKey: ["support-tickets"] });

      const previousTicket = queryClient.getQueryData<SupportTicket>(["support-ticket", id]);
      const previousTickets = queryClient.getQueryData<SupportTicket[]>(["support-tickets"]);

      if (previousTicket) {
        queryClient.setQueryData<SupportTicket>(["support-ticket", id], {
          ...previousTicket,
          status,
        });
      }

      if (previousTickets) {
        queryClient.setQueryData<SupportTicket[]>(
          ["support-tickets"],
          previousTickets.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket)),
        );
      }

      return { previousTicket, previousTickets };
    },
    onError: (_error, { id }, context) => {
      if (context?.previousTicket) {
        queryClient.setQueryData(["support-ticket", id], context.previousTicket);
      }
      if (context?.previousTickets) {
        queryClient.setQueryData(["support-tickets"], context.previousTickets);
      }
    },
    onSuccess: async (updatedTicket, { id }) => {
      queryClient.setQueryData(["support-ticket", id], updatedTicket);
      queryClient.setQueryData<SupportTicket[]>(["support-tickets"], (current) => {
        if (!current) return current;
        return current.map((ticket) => (ticket.id === id ? updatedTicket : ticket));
      });
      await queryClient.invalidateQueries({ queryKey: ["support-ticket", id] });
      await queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      await queryClient.invalidateQueries({ queryKey: dashboardQueryKey });
    },
  });
}
