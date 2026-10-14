import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/api';
import { useFilters } from '../../store/useFilters';
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
