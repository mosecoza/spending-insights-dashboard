import { useQuery } from '@tanstack/react-query';
import { queryKeys, DEMO_CUSTOMER_ID } from '../../lib/api';
import { useFilters } from '../../store/useFilters';
import { getTrends } from './api';

export function useTrends() {
  const months = useFilters((state) => state.months);
  return useQuery({
    queryKey: queryKeys.trends(DEMO_CUSTOMER_ID, months),
    queryFn: () => getTrends(months),
  });
}
