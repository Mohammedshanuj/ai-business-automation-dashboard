import { useQuery } from "@tanstack/react-query";

import { getDashboardData } from "@/services/dashboardService";

export const dashboardQueryKey = ["dashboard"] as const;

export function useDashboard() {
  const query = useQuery({
    queryKey: dashboardQueryKey,
    queryFn: getDashboardData,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}
