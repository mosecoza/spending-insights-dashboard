import axios from 'axios';
import { customerIdSchema } from './validation';
import type { Period, SortBy } from 'Types/api';

export const api = axios.create({ baseURL: '/api', timeout: 10000 });

export const queryKeys = {
  profile: (id: string) => ['profile', id] as const,
  summary: (id: string, period: Period) => ['summary', id, period] as const,
  categories: (id: string, p: { period: Period; startDate?: string; endDate?: string }) =>
    ['categories', id, p] as const,
  trends: (id: string, months: number) => ['trends', id, months] as const,
  transactions: (
    id: string,
    q: {
      limit: number;
      offset: number;
      category?: string;
      startDate?: string;
      endDate?: string;
      sortBy: SortBy;
    },
  ) => ['transactions', id, q] as const,
  goals: (id: string) => ['goals', id] as const,
  filters: (id: string) => ['filters', id] as const,
};

export const DEFAULT_CUSTOMER_ID = '12345';
export const customerApiPath = (customerId: string, resource: string) =>
  `/customers/${encodeURIComponent(customerIdSchema.parse(customerId))}/${resource}`;
export const zar = (n: number) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(n);

const saDateFormatter = new Intl.DateTimeFormat('en-ZA', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Africa/Johannesburg',
});

/** Format ISO date strings for display in South African dd/mm/yyyy order. */
export const formatDateSA = (value: string): string => {
  // Only treat as a bare calendar date when the whole string is YYYY-MM-DD.
  // ISO timestamps (e.g. 2024-09-16T23:00:00.000Z) must be parsed and
  // converted to Johannesburg time so late-UTC-day instants show the
  // correct local calendar date.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return saDateFormatter.format(parsed);
};

/** Parse a South African dd/mm/yyyy string into ISO YYYY-MM-DD, or null if invalid. */
export function parseDateSA(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, day, month, year] = match;
  const iso = `${year}-${month}-${day}`;
  const parsed = new Date(`${iso}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  if (
    parsed.getUTCDate() !== Number(day) ||
    parsed.getUTCMonth() + 1 !== Number(month) ||
    parsed.getUTCFullYear() !== Number(year)
  )
    return null;
  return iso;
}
