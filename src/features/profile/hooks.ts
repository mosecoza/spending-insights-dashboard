import { useQuery } from '@tanstack/react-query';
import { queryKeys, DEMO_CUSTOMER_ID } from '../../lib/api';
import { getProfile } from './api';

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile(DEMO_CUSTOMER_ID),
    queryFn: getProfile,
  });
}
