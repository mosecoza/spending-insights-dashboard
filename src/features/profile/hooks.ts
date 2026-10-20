import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'Lib/api';
import { useFilters } from 'Store/useFilters';
import { getProfile } from './api';

export function useProfile() {
  const customerId = useFilters((state) => state.customerId);
  return useQuery({
    queryKey: queryKeys.profile(customerId),
    queryFn: () => getProfile(customerId),
    enabled: customerId.length > 0,
  });
}
