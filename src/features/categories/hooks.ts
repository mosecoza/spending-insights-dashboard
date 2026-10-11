import { useQuery } from '@tanstack/react-query';
import { queryKeys, DEMO_CUSTOMER_ID } from '../../lib/api';
import { useFilters } from '../../store/useFilters';
import { getCategories } from './api';

export function useCategories() {
  const { period, startDate, endDate } = useFilters();
  return useQuery({
    queryKey: queryKeys.categories(DEMO_CUSTOMER_ID, { period, startDate, endDate }),
    queryFn: () => getCategories({ period, startDate, endDate }),
  });
}
