import { api, customerApiPath } from '../../lib/api';
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
  const response = await api.get(customerApiPath(customerId, 'spending/categories'), {
    params: validFilters,
  });
  return categoriesResponseSchema.parse(response.data);
}
