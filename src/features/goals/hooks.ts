import { useQuery } from '@tanstack/react-query';
import { queryKeys, DEMO_CUSTOMER_ID } from '../../lib/api';
import { getGoals } from './api';

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals(DEMO_CUSTOMER_ID),
    queryFn: getGoals,
  });
}
