import { api, DEMO_CUSTOMER_ID } from '../../lib/api';
import { transactionsQuerySchema } from '../../lib/validation';
import type { FiltersResponse, SortBy, TransactionsResponse } from '../../types/api';

export async function getTransactions(filters: {
  limit: number;
  offset: number;
  category?: string;
  startDate?: string;
  endDate?: string;
  sortBy: SortBy;
}) {
  const validFilters = transactionsQuerySchema.parse(filters);
  return (
    await api.get<TransactionsResponse>(`/customers/${DEMO_CUSTOMER_ID}/transactions`, {
      params: validFilters,
    })
  ).data;
}

export async function getFilterMeta() {
  return (await api.get<FiltersResponse>(`/customers/${DEMO_CUSTOMER_ID}/filters`)).data;
}
