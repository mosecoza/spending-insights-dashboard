import { api, customerApiPath } from 'Lib/api';
import {
  filtersResponseSchema,
  transactionsQuerySchema,
  transactionsResponseSchema,
} from 'Lib/validation';
import type { SortBy } from 'Types/api';

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
