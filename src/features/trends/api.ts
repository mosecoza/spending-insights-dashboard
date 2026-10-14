import { api, customerApiPath } from '../../lib/api';
import { trendsQuerySchema } from '../../lib/validation';
import type { TrendPoint } from '../../types/api';

export async function getTrends(customerId: string, months: number) {
  const filters = trendsQuerySchema.parse({ months });
  return (
    await api.get<{ trends: TrendPoint[] }>(customerApiPath(customerId, 'spending/trends'), {
      params: filters,
    })
  ).data;
}
