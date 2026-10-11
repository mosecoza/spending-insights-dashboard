import { api, DEMO_CUSTOMER_ID } from '../../lib/api';
import { categoriesQuerySchema } from '../../lib/validation';
import type { CategoriesResponse, Period } from '../../types/api';

export async function getCategories(filters: {
  period: Period;
  startDate?: string;
  endDate?: string;
}) {
  const validFilters = categoriesQuerySchema.parse(filters);
  return (
    await api.get<CategoriesResponse>(`/customers/${DEMO_CUSTOMER_ID}/spending/categories`, {
      params: validFilters,
    })
  ).data;
}
