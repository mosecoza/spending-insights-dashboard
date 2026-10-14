import { api, customerApiPath } from '../../lib/api';
import { categoriesQuerySchema } from '../../lib/validation';
import type { CategoriesResponse, Period } from '../../types/api';

export async function getCategories(filters: {
  customerId: string;
  period: Period;
  startDate?: string;
  endDate?: string;
}) {
  const { customerId, ...query } = filters;
  const validFilters = categoriesQuerySchema.parse(query);
  return (
    await api.get<CategoriesResponse>(customerApiPath(customerId, 'spending/categories'), {
      params: validFilters,
    })
  ).data;
}
