import { api, customerApiPath } from '../../lib/api';
import { goalsResponseSchema } from '../../lib/validation';

export async function getGoals(customerId: string) {
  const response = await api.get(customerApiPath(customerId, 'goals'));
  return goalsResponseSchema.parse(response.data);
}
