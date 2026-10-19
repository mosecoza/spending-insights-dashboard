import { api, customerApiPath } from '../../lib/api';
import {
  filtersResponseSchema,
  transactionsQuerySchema,
  transactionsResponseSchema,
} from '../../lib/validation';
import type { SortBy } from '../../types/api';

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
  const response = await api.get(customerApiPath(customerId, 'transactions'), {
    params: validFilters,
  });
  return transactionsResponseSchema.parse(response.data);
}

export async function getFilterMeta(customerId: string) {
  const response = await api.get(customerApiPath(customerId, 'filters'));
  return filtersResponseSchema.parse(response.data);
}
