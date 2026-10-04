import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardQueryKey } from "@/hooks/useDashboard";
import { getLeadById, getLeads, LeadNotFoundError, updateLeadStatus } from "@/services/leadService";
import type { Lead, LeadStatus } from "@/types/lead";

export function useLeads({ enabled = true }: { enabled?: boolean } = {}) {
  const query = useQuery({
    queryKey: ["leads"],
    queryFn: getLeads,
    enabled,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useLead(id: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["lead", id],
    queryFn: () => getLeadById(id),
    initialData: () => queryClient.getQueryData<Lead[]>(["leads"])?.find((lead) => lead.id === id),
    initialDataUpdatedAt: () => queryClient.getQueryState<Lead[]>(["leads"])?.dataUpdatedAt ?? 0,
    retry: (failureCount, error) => !(error instanceof LeadNotFoundError) && failureCount < 2,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isNotFound: query.error instanceof LeadNotFoundError,
    refetch: query.refetch,
  };
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      updateLeadStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["lead", id] });
      await queryClient.cancelQueries({ queryKey: ["leads"] });

      const previousLead = queryClient.getQueryData<Lead>(["lead", id]);
      const previousLeads = queryClient.getQueryData<Lead[]>(["leads"]);

      if (previousLead) {
        queryClient.setQueryData<Lead>(["lead", id], { ...previousLead, status });
      }

      if (previousLeads) {
        queryClient.setQueryData<Lead[]>(
          ["leads"],
          previousLeads.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
        );
      }

      return { previousLead, previousLeads };
    },
    onError: (_error, { id }, context) => {
      if (context?.previousLead) {
        queryClient.setQueryData(["lead", id], context.previousLead);
      }
      if (context?.previousLeads) {
        queryClient.setQueryData(["leads"], context.previousLeads);
      }
    },
    onSuccess: async (updatedLead, { id }) => {
      queryClient.setQueryData(["lead", id], updatedLead);
      queryClient.setQueryData<Lead[]>(["leads"], (current) => {
        if (!current) return current;
        return current.map((lead) => (lead.id === id ? updatedLead : lead));
      });
      await queryClient.invalidateQueries({ queryKey: ["lead", id] });
      await queryClient.invalidateQueries({ queryKey: ["leads"] });
      await queryClient.invalidateQueries({ queryKey: dashboardQueryKey });
    },
  });
}
