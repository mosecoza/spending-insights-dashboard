import { api, customerApiPath } from '../../lib/api';
import { periodSchema, spendingSummarySchema } from '../../lib/validation';
import type { Period } from '../../types/api';

export async function getSummary(customerId: string, period: Period) {
  const validPeriod = periodSchema.parse(period);
  const response = await api.get(customerApiPath(customerId, 'spending/summary'), {
    params: { period: validPeriod },
  });
  return spendingSummarySchema.parse(response.data);
}
