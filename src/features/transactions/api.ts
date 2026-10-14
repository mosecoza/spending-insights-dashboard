import { api, customerApiPath } from '../../lib/api';
import { transactionsQuerySchema } from '../../lib/validation';
import type { FiltersResponse, SortBy, TransactionsResponse } from '../../types/api';

export async function getTransactions(filters: {
  customerId: string;
  limit: number;
  offset: number;
  category?: string;
  startDate?: string;
  endDate?: string;
  sortBy: SortBy;
}) {
  const { customerId, ...query } = filters;
  const validFilters = transactionsQuerySchema.parse(query);
  return (
    await api.get<TransactionsResponse>(customerApiPath(customerId, 'transactions'), {
      params: validFilters,
    })
  ).data;
}

export async function getFilterMeta(customerId: string) {
  return (await api.get<FiltersResponse>(customerApiPath(customerId, 'filters'))).data;
}
