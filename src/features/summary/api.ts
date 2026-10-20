import { api, customerApiPath } from 'Lib/api';
import { periodSchema, spendingSummarySchema } from 'Lib/validation';
import type { Period } from 'Types/api';

export async function getSummary(customerId: string, period: Period) {
  const validPeriod = periodSchema.parse(period);
  const response = await api.get(customerApiPath(customerId, 'spending/summary'), {
    params: { period: validPeriod },
  });
  return spendingSummarySchema.parse(response.data);
}
