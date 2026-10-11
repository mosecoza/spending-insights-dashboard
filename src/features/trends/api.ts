import { api, DEMO_CUSTOMER_ID } from '../../lib/api';
import { trendsQuerySchema } from '../../lib/validation';
import type { TrendPoint } from '../../types/api';

export async function getTrends(months: number) {
  const filters = trendsQuerySchema.parse({ months });
  return (
    await api.get<{ trends: TrendPoint[] }>(`/customers/${DEMO_CUSTOMER_ID}/spending/trends`, {
      params: filters,
    })
  ).data;
}
