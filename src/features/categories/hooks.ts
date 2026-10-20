import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/api';
import { completeDateRange } from '../../lib/dateRange';
import { useFilters } from '../../store/useFilters';
import { getCategories } from './api';

export function useCategories() {
  const customerId = useFilters((state) => state.customerId);
  const period = useFilters((state) => state.period);
  const startDate = useFilters((state) => state.startDate);
  const endDate = useFilters((state) => state.endDate);
  const dateRange = completeDateRange(startDate, endDate);
  return useQuery({
    queryKey: queryKeys.categories(customerId, { period, ...dateRange }),
    queryFn: () => getCategories({ customerId, period, ...dateRange }),
    enabled: customerId.length > 0,
  });
}
