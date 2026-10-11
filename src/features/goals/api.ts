import { api, DEMO_CUSTOMER_ID } from '../../lib/api';
import type { Goal } from '../../types/api';

export async function getGoals() {
  return (await api.get<{ goals: Goal[] }>(`/customers/${DEMO_CUSTOMER_ID}/goals`)).data;
}
