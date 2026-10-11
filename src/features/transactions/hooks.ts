import { useQuery } from '@tanstack/react-query';
import { queryKeys, DEMO_CUSTOMER_ID } from '../../lib/api';
import { useFilters } from '../../store/useFilters';
import { getFilterMeta, getTransactions } from './api';

export function useTransactions() {
  const { limit, page, category, startDate, endDate, sortBy } = useFilters();
  const offset = page * limit;
  return useQuery({
    queryKey: queryKeys.transactions(DEMO_CUSTOMER_ID, {
      limit,
      offset,
      category,
      startDate,
      endDate,
      sortBy,
    }),
    queryFn: () => getTransactions({ limit, offset, category, startDate, endDate, sortBy }),
    placeholderData: (previous) => previous,
  });
}

export function useFilterMeta() {
  return useQuery({
    queryKey: queryKeys.filters(DEMO_CUSTOMER_ID),
    queryFn: getFilterMeta,
    staleTime: Infinity,
  });
}
