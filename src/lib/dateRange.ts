import type { Period } from '../types/api';

export const DEMO_DATE_ANCHOR = '2024-09-16';

const periodDays: Record<Period, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '1y': 365,
};

export function periodDateRange(period: Period, endDate: string): { startDate: string; endDate: string } {
  const end = new Date(`${endDate}T00:00:00.000Z`);
  end.setUTCDate(end.getUTCDate() - periodDays[period] + 1);
  return { startDate: end.toISOString().slice(0, 10), endDate };
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
