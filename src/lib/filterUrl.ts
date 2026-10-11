import { dashboardFiltersSchema } from './validation';
import type { Period, SortBy } from '../types/api';

export interface DashboardFilters {
  period: Period;
  startDate?: string;
  endDate?: string;
  category?: string;
  sortBy: SortBy;
  page: number;
}

const defaults: DashboardFilters = {
  period: '30d',
  sortBy: 'date_desc',
  page: 0,
};

export function parseFilterSearch(search: string): DashboardFilters {
  const params = new URLSearchParams(search);
  const parsed = dashboardFiltersSchema.safeParse({
    period: params.get('period') ?? undefined,
    startDate: params.get('startDate') ?? undefined,
    endDate: params.get('endDate') ?? undefined,
    category: params.get('category') ?? undefined,
    sortBy: params.get('sortBy') ?? undefined,
    page: params.get('page') ?? undefined,
  });

  return parsed.success ? parsed.data : defaults;
}

export function serializeFilterSearch(filters: DashboardFilters): string {
  const parsed = dashboardFiltersSchema.safeParse(filters);
  const params = new URLSearchParams();
  if (!parsed.success) return '';

  const value = parsed.data;
  if (value.period !== defaults.period) params.set('period', value.period);
  if (value.startDate) params.set('startDate', value.startDate);
  if (value.endDate) params.set('endDate', value.endDate);
  if (value.category) params.set('category', value.category);
  if (value.sortBy !== defaults.sortBy) params.set('sortBy', value.sortBy);
  if (value.page > 0) params.set('page', String(value.page));
  return params.toString();
}
