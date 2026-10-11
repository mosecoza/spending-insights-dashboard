import { api, DEMO_CUSTOMER_ID } from '../../lib/api';
import { periodSchema } from '../../lib/validation';
import type { Period, SpendingSummary } from '../../types/api';

export async function getSummary(period: Period) {
  const validPeriod = periodSchema.parse(period);
  return (
    await api.get<SpendingSummary>(`/customers/${DEMO_CUSTOMER_ID}/spending/summary`, {
      params: { period: validPeriod },
    })
  ).data;
}
