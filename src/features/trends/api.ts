import { api, customerApiPath } from 'Lib/api';
import { trendsQuerySchema, trendsResponseSchema } from 'Lib/validation';

export async function getTrends(customerId: string, months: number) {
  const filters = trendsQuerySchema.parse({ months });
  const response = await api.get(customerApiPath(customerId, 'spending/trends'), {
    params: filters,
  });
  return trendsResponseSchema.parse(response.data);
}
