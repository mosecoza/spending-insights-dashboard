import { api, customerApiPath } from '../../lib/api';
import { completeDateRange } from '../../lib/dateRange';
import { categoriesQuerySchema, categoriesResponseSchema } from '../../lib/validation';
import type { Period } from '../../types/api';

export async function getCategories(filters: {
  customerId: string;
  period: Period;
  startDate?: string;
  endDate?: string;
}) {
  const { customerId, ...query } = filters;
  const validFilters = categoriesQuerySchema.parse(query);
  const dateRange = completeDateRange(validFilters.startDate, validFilters.endDate);
  const response = await api.get(customerApiPath(customerId, 'spending/categories'), {
    params: { period: validFilters.period, ...dateRange },
  });
  return categoriesResponseSchema.parse(response.data);
}
