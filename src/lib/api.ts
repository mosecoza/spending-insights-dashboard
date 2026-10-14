import axios from 'axios';
import { customerIdSchema } from './validation';
import type { Period, SortBy } from '../types/api';

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
