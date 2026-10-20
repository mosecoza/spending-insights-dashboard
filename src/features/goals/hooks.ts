import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'Lib/api';
import { useFilters } from 'Store/useFilters';
import { getGoals } from './api';

export function useGoals() {
  const customerId = useFilters((state) => state.customerId);
  return useQuery({
    queryKey: queryKeys.goals(customerId),
    queryFn: () => getGoals(customerId),
    enabled: customerId.length > 0,
  });
}
