import { api, customerApiPath } from '../../lib/api';
import { periodSchema } from '../../lib/validation';
import type { Period, SpendingSummary } from '../../types/api';

export async function getSummary(customerId: string, period: Period) {
  const validPeriod = periodSchema.parse(period);
  return (
    await api.get<SpendingSummary>(customerApiPath(customerId, 'spending/summary'), {
      params: { period: validPeriod },
    })
  ).data;
}
