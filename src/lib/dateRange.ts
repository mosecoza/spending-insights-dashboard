import { format, parseISO, subDays } from 'date-fns';
import type { Period } from 'Types/api';

export const DEMO_DATE_ANCHOR = '2024-09-16';
export const DEMO_TRANSACTION_COUNT = 1250;
export const DEMO_FIXTURE_START_DATE = format(
  subDays(parseISO(DEMO_DATE_ANCHOR), DEMO_TRANSACTION_COUNT - 1),
  'yyyy-MM-dd',
);
export const DEFAULT_DATE_RANGE = { startDate: '2024-06-01', endDate: '2024-06-30' };

export function completeDateRange(startDate?: string, endDate?: string) {
  return startDate && endDate ? { startDate, endDate } : {};
}

const periodDays: Record<Period, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '1y': 365,
};

export function periodDateRange(
  period: Period,
  endDate: string,
): { startDate: string; endDate: string } {
  const start = subDays(parseISO(endDate), periodDays[period] - 1);
  return { startDate: format(start, 'yyyy-MM-dd'), endDate };
}

export function resolveDateRange(
  period: Period,
  startDate?: string,
  endDate?: string,
  asOf = DEMO_DATE_ANCHOR,
): { startDate: string; endDate: string } {
  const periodRange = periodDateRange(period, asOf);
  return {
    startDate: startDate ?? periodRange.startDate,
    endDate: endDate ?? periodRange.endDate,
  };
}
