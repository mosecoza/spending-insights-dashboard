import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'Lib/api';
import { useFilters } from 'Store/useFilters';
import { getSummary } from './api';

export function useSummary() {
  const customerId = useFilters((state) => state.customerId);
  const period = useFilters((state) => state.period);
  return useQuery({
    queryKey: queryKeys.summary(customerId, period),
    queryFn: () => getSummary(customerId, period),
    enabled: customerId.length > 0,
  });
}
