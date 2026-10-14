import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/api';
import { useFilters } from '../../store/useFilters';
import { getFilterMeta, getTransactions } from './api';

export function useTransactions() {
  const customerId = useFilters((state) => state.customerId);
  const limit = useFilters((state) => state.limit);
  const page = useFilters((state) => state.page);
  const category = useFilters((state) => state.category);
  const startDate = useFilters((state) => state.startDate);
  const endDate = useFilters((state) => state.endDate);
  const sortBy = useFilters((state) => state.sortBy);
  const offset = page * limit;
  return useQuery({
    queryKey: queryKeys.transactions(customerId, {
      limit,
      offset,
      category,
      startDate,
      endDate,
      sortBy,
    }),
    queryFn: () =>
      getTransactions({ customerId, limit, offset, category, startDate, endDate, sortBy }),
    enabled: customerId.length > 0,
    placeholderData: (previous, previousQuery) =>
      previousQuery?.queryKey[1] === customerId ? previous : undefined,
  });
}

export function useFilterMeta() {
  const customerId = useFilters((state) => state.customerId);
  return useQuery({
    queryKey: queryKeys.filters(customerId),
    queryFn: () => getFilterMeta(customerId),
    enabled: customerId.length > 0,
    staleTime: Infinity,
  });
}
