// Runtime enforcement of docs/API_CONTRACT.md. Response and query schemas mirror
// the DTOs in src/types/api.ts by hand; types are never derived via z.infer so
// the Markdown contract stays the normative source of truth - see docs/ARCHITECTURE.md.
import { z } from 'zod';

export const periodSchema = z.enum(['7d', '30d', '90d', '1y']);
export const sortBySchema = z.enum(['date_desc', 'date_asc', 'amount_desc', 'amount_asc']);
export const customerIdSchema = z.string().trim().min(1).max(80);
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

export const comparedToPreviousSchema = z.object({
  spentChange: z.number(),
  transactionChange: z.number(),
});

export const spendingSummarySchema = z.object({
  period: periodSchema,
  totalSpent: z.number(),
  transactionCount: z.number().int().min(0),
  averageTransaction: z.number(),
  topCategory: z.string(),
  comparedToPrevious: comparedToPreviousSchema,
});

export const customerProfileSchema = z.object({
  customerId: z.string(),
  name: z.string(),
  email: z.string(),
  joinDate: z.string(),
  accountType: z.string(),
  totalSpent: z.number(),
  currency: z.literal('ZAR'),
});

export const dateRangeObjectSchema = z.object({
  startDate: dateSchema,
  endDate: dateSchema,
});

export const categoriesResponseSchema = z.object({
  dateRange: dateRangeObjectSchema,
  totalAmount: z.number(),
  categories: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
      percentage: z.number(),
      transactionCount: z.number().int().min(0),
      color: z.string(),
      icon: z.string(),
    }),
  ),
});

export const trendsResponseSchema = z.object({
  trends: z.array(
    z.object({
      month: z.string(),
      totalSpent: z.number(),
      transactionCount: z.number().int().min(0),
      averageTransaction: z.number(),
    }),
  ),
});

export const paginationSchema = z.object({
  total: z.number().int().min(0),
  limit: z.number().int().min(1),
  offset: z.number().int().min(0),
  hasMore: z.boolean(),
});

export const transactionsResponseSchema = z.object({
  transactions: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      merchant: z.string(),
      category: z.string(),
      amount: z.number(),
      description: z.string(),
      paymentMethod: z.string(),
      icon: z.string(),
      categoryColor: z.string(),
    }),
  ),
  pagination: paginationSchema,
});

export const goalsResponseSchema = z.object({
  goals: z.array(
    z.object({
      id: z.string(),
      category: z.string(),
      monthlyBudget: z.number(),
      currentSpent: z.number(),
      percentageUsed: z.number(),
      daysRemaining: z.number().int().min(0),
      status: z.enum(['on_track', 'warning', 'over_budget']),
    }),
  ),
});

export const filterCategorySchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
});

export const dateRangePresetSchema = z.object({ label: z.string(), value: periodSchema });

export const filtersResponseSchema = z.object({
  categories: z.array(filterCategorySchema),
  dateRangePresets: z.array(dateRangePresetSchema),
});
