import { http, HttpResponse } from 'msw';
import seed from './seed.json';
import {
  categoriesQuerySchema,
  periodSchema,
  transactionsQuerySchema,
  trendsQuerySchema,
} from '../lib/validation';
import { filterTransactions, getCategories, getSummary, getTrends } from './data';

// MSW handlers - mirror docs/API_CONTRACT.md exactly. AI: do not invent endpoints.
const CID = ':customerId';
export const handlers = [
  http.get(`/api/customers/${CID}/profile`, () =>
    HttpResponse.json({ customerId: '12345', name: 'John Doe', email: 'john.doe@email.com', joinDate: '2023-01-15', accountType: 'premium', totalSpent: 15420.5, currency: 'ZAR' })),
  http.get(`/api/customers/${CID}/spending/summary`, ({ request }) => {
    const { searchParams } = new URL(request.url);
    const parsed = periodSchema.safeParse(searchParams.get('period') ?? '30d');
    if (!parsed.success) return HttpResponse.json({ error: 'Invalid period' }, { status: 400 });
    return HttpResponse.json(getSummary(parsed.data));
  }),
  http.get(`/api/customers/${CID}/spending/categories`, ({ request }) => {
    const parsed = categoriesQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
    if (!parsed.success) return HttpResponse.json({ error: 'Invalid category query' }, { status: 400 });
    return HttpResponse.json(getCategories(parsed.data.period, parsed.data.startDate, parsed.data.endDate));
  }),
  http.get(`/api/customers/${CID}/spending/trends`, ({ request }) => {
    const parsed = trendsQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
    if (!parsed.success) return HttpResponse.json({ error: 'Invalid trends query' }, { status: 400 });
    return HttpResponse.json({ trends: getTrends(parsed.data.months) });
  }),
  http.get(`/api/customers/${CID}/transactions`, ({ request }) => {
    const parsed = transactionsQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
    if (!parsed.success) return HttpResponse.json({ error: 'Invalid transaction query' }, { status: 400 });
    const { limit, offset, ...filters } = parsed.data;
    const transactions = filterTransactions(filters);
    return HttpResponse.json({
      transactions: transactions.slice(offset, offset + limit),
      pagination: {
        total: transactions.length,
        limit,
        offset,
        hasMore: offset + limit < transactions.length,
      },
    });
  }),
  http.get(`/api/customers/${CID}/goals`, () => HttpResponse.json(seed.goals)),
  http.get(`/api/customers/${CID}/filters`, () => HttpResponse.json(seed.filters)),
];
