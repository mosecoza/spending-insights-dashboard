import { useQuery } from '@tanstack/react-query';
import { queryKeys, DEMO_CUSTOMER_ID } from '../../lib/api';
import { useFilters } from '../../store/useFilters';
import { getSummary } from './api';

export function useSummary() {
  const period = useFilters((state) => state.period);
  return useQuery({
    queryKey: queryKeys.summary(DEMO_CUSTOMER_ID, period),
    queryFn: () => getSummary(period),
  });
}
