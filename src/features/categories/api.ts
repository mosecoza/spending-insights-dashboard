import { api, customerApiPath } from 'Lib/api';
import { categoriesQuerySchema, categoriesResponseSchema } from 'Lib/validation';
import type { Period } from 'Types/api';

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
