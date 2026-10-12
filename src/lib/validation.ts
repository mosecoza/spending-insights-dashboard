import { z } from 'zod';

export const periodSchema = z.enum(['7d', '30d', '90d', '1y']);
export const sortBySchema = z.enum(['date_desc', 'date_asc', 'amount_desc', 'amount_asc']);
export const dateSchema = z.string().date();
export const categorySchema = z.string().trim().min(1).max(80);
export const transactionLimitSchema = z.coerce.number().int().min(1).max(100);
export const dateRangeSchema = z
  .object({ startDate: dateSchema.optional(), endDate: dateSchema.optional() })
  .refine(
    (v) => !v.startDate || !v.endDate || v.startDate <= v.endDate,
    'startDate must be before endDate',
  );

export const dashboardFiltersSchema = z
  .object({
    period: periodSchema.default('30d'),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
    category: z.string().trim().min(1).max(80).optional(),
    sortBy: sortBySchema.default('date_desc'),
    page: z.coerce.number().int().min(0).default(0),
    limit: transactionLimitSchema.default(20),
    months: z.coerce.number().int().min(1).max(24).default(12),
  })
  .refine(
    (filters) => !filters.startDate || !filters.endDate || filters.startDate <= filters.endDate,
    { path: ['endDate'], message: 'End date must be on or after start date' },
  );

export const transactionsQuerySchema = z
  .object({
    limit: transactionLimitSchema.default(20),
    offset: z.coerce.number().int().min(0).default(0),
    category: z.string().trim().min(1).max(80).optional(),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
    sortBy: sortBySchema.default('date_desc'),
  })
  .refine((query) => !query.startDate || !query.endDate || query.startDate <= query.endDate, {
    path: ['endDate'],
    message: 'End date must be on or after start date',
  });

export const categoriesQuerySchema = z
  .object({
    period: periodSchema.default('30d'),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
  })
  .refine((query) => !query.startDate || !query.endDate || query.startDate <= query.endDate, {
    path: ['endDate'],
    message: 'End date must be on or after start date',
  });

export const trendsQuerySchema = z.object({
  months: z.coerce.number().int().min(1).max(24).default(12),
});
