import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/api';
import { useFilters } from '../../store/useFilters';
import { getGoals } from './api';

export function useGoals() {
  const customerId = useFilters((state) => state.customerId);
  return useQuery({
    queryKey: queryKeys.goals(customerId),
    queryFn: () => getGoals(customerId),
    enabled: customerId.length > 0,
  });
}
