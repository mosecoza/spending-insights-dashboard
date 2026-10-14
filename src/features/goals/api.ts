import { api, customerApiPath } from '../../lib/api';
import type { Goal } from '../../types/api';

export async function getGoals(customerId: string) {
  return (await api.get<{ goals: Goal[] }>(customerApiPath(customerId, 'goals'))).data;
}
