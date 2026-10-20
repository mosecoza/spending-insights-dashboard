import { api, customerApiPath } from 'Lib/api';
import { goalsResponseSchema } from 'Lib/validation';

export async function getGoals(customerId: string) {
  const response = await api.get(customerApiPath(customerId, 'goals'));
  return goalsResponseSchema.parse(response.data);
}
