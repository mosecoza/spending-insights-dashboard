import { useQuery } from '@tanstack/react-query';
import { api, queryKeys, DEMO_CUSTOMER_ID } from '../../lib/api';
import type { CustomerProfile, SpendingSummary, CategoriesResponse, TrendPoint, TransactionsResponse, Goal, FiltersResponse, Period, SortBy } from '../../types/api';
import { useFilters } from '../../store/useFilters';
import {
  categoriesQuerySchema,
  periodSchema,
  transactionsQuerySchema,
} from '../../lib/validation';

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile(DEMO_CUSTOMER_ID),
    queryFn: async () => (await api.get<CustomerProfile>(`/customers/${DEMO_CUSTOMER_ID}/profile`)).data,
  });
}

export function useSummary() {
  const period = useFilters((s) => s.period);
  return useQuery({
    queryKey: queryKeys.summary(DEMO_CUSTOMER_ID, period),
    queryFn: async () => {
      const validPeriod = periodSchema.parse(period);
      return (await api.get<SpendingSummary>(`/customers/${DEMO_CUSTOMER_ID}/spending/summary`, { params: { period: validPeriod } })).data;
    },
  });
}

export function useCategories() {
  const { period, startDate, endDate } = useFilters();
  return useQuery({
    queryKey: queryKeys.categories(DEMO_CUSTOMER_ID, { period, startDate, endDate }),
    queryFn: async () => {
      const filters = categoriesQuerySchema.parse({ period, startDate, endDate });
      return (await api.get<CategoriesResponse>(`/customers/${DEMO_CUSTOMER_ID}/spending/categories`, { params: filters })).data;
    },
  });
}

export function useTrends() {
  const months = useFilters((s) => s.months);
  return useQuery({
    queryKey: queryKeys.trends(DEMO_CUSTOMER_ID, months),
    queryFn: async () =>
      (await api.get<{ trends: TrendPoint[] }>(`/customers/${DEMO_CUSTOMER_ID}/spending/trends`, { params: { months } })).data,
  });
}

export function useTransactions() {
  const { limit, page, category, startDate, endDate, sortBy } = useFilters();
  const offset = page * limit;
  return useQuery({
    queryKey: queryKeys.transactions(DEMO_CUSTOMER_ID, { limit, offset, category, startDate, endDate, sortBy }),
    queryFn: async () => {
      const filters = transactionsQuerySchema.parse({
        limit,
        offset,
        category,
        startDate,
        endDate,
        sortBy,
      });
      return (await api.get<TransactionsResponse>(`/customers/${DEMO_CUSTOMER_ID}/transactions`, {
        params: filters,
      })).data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals(DEMO_CUSTOMER_ID),
    queryFn: async () =>
      (await api.get<{ goals: Goal[] }>(`/customers/${DEMO_CUSTOMER_ID}/goals`)).data,
  });
}

export function useFilterMeta() {
  return useQuery({
    queryKey: queryKeys.filters(DEMO_CUSTOMER_ID),
    queryFn: async () =>
      (await api.get<FiltersResponse>(`/customers/${DEMO_CUSTOMER_ID}/filters`)).data,
    staleTime: Infinity,
  });
}

export type { Period, SortBy };
