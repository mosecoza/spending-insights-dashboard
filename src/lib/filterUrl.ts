import { Period, SortBy } from 'Types/api';
import { DEFAULT_DATE_RANGE } from './dateRange';
import { dashboardFiltersSchema } from './validation';

export interface DashboardFilters {
  period: Period;
  startDate?: string;
  endDate?: string;
  category?: string;
  sortBy: SortBy;
  page: number;
  limit: number;
  months: number;
}

const defaults: DashboardFilters = {
  period: '30d',
  ...DEFAULT_DATE_RANGE,
  sortBy: 'date_desc',
  page: 0,
  limit: 20,
  months: 12,
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
    limit: params.get('limit') ?? undefined,
    months: params.get('months') ?? undefined,
  });

  if (!parsed.success) return defaults;
  return params.has('startDate') || params.has('endDate')
    ? parsed.data
    : { ...parsed.data, ...DEFAULT_DATE_RANGE };
}

export function serializeFilterSearch(filters: DashboardFilters): string {
  const parsed = dashboardFiltersSchema.safeParse(filters);
  const params = new URLSearchParams();
  if (!parsed.success) return '';

  const value = parsed.data;
  if (value.period !== defaults.period) params.set('period', value.period);
  const isDefaultRange =
    value.startDate === DEFAULT_DATE_RANGE.startDate &&
    value.endDate === DEFAULT_DATE_RANGE.endDate;
  if (!isDefaultRange) {
    if (value.startDate) params.set('startDate', value.startDate);
    if (value.endDate) params.set('endDate', value.endDate);
  }
  if (value.category) params.set('category', value.category);
  if (value.sortBy !== defaults.sortBy) params.set('sortBy', value.sortBy);
  if (value.page > 0) params.set('page', String(value.page));
  if (value.limit !== defaults.limit) params.set('limit', String(value.limit));
  if (value.months !== defaults.months) params.set('months', String(value.months));
  return params.toString();
}
