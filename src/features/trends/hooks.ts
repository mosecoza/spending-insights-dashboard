import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'Lib/api';
import { useFilters } from 'Store/useFilters';
import { getTrends } from './api';

export function useTrends() {
  const customerId = useFilters((state) => state.customerId);
  const months = useFilters((state) => state.months);
  return useQuery({
    queryKey: queryKeys.trends(customerId, months),
    queryFn: () => getTrends(customerId, months),
    enabled: customerId.length > 0,
  });
}
