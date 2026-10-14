import { http, HttpResponse } from 'msw';
import seed from './seed.json';
import {
  categoriesQuerySchema,
  periodSchema,
  transactionsQuerySchema,
  trendsQuerySchema,
} from '../lib/validation';
import { findDemoCustomer } from '../lib/demoCustomers';
import {
  filterTransactions,
  getCategories,
  getCustomerProfile,
  getGoals,
  getSummary,
  getTrends,
} from './data';

// MSW handlers - mirror docs/API_CONTRACT.md exactly. AI: do not invent endpoints.
const CID = ':customerId';
const customerNotFound = () => HttpResponse.json({ error: 'Customer not found' }, { status: 404 });
export const handlers = [
  http.get(`*/api/customers/${CID}/profile`, ({ params }) =>
    findDemoCustomer(String(params.customerId))
      ? HttpResponse.json(getCustomerProfile(String(params.customerId)))
      : customerNotFound(),
  ),
  http.get(`*/api/customers/${CID}/spending/summary`, ({ request, params }) => {
    const customerId = String(params.customerId);
    if (!findDemoCustomer(customerId)) return customerNotFound();
    const { searchParams } = new URL(request.url);
    const parsed = periodSchema.safeParse(searchParams.get('period') ?? '30d');
    if (!parsed.success) return HttpResponse.json({ error: 'Invalid period' }, { status: 400 });
    return HttpResponse.json(getSummary(parsed.data, customerId));
  }),
  http.get(`*/api/customers/${CID}/spending/categories`, ({ request, params }) => {
    const customerId = String(params.customerId);
    if (!findDemoCustomer(customerId)) return customerNotFound();
    const parsed = categoriesQuerySchema.safeParse(
      Object.fromEntries(new URL(request.url).searchParams),
    );
    if (!parsed.success)
      return HttpResponse.json({ error: 'Invalid category query' }, { status: 400 });
    return HttpResponse.json(
      getCategories(parsed.data.period, parsed.data.startDate, parsed.data.endDate, customerId),
    );
  }),
  http.get(`*/api/customers/${CID}/spending/trends`, ({ request, params }) => {
    const customerId = String(params.customerId);
    if (!findDemoCustomer(customerId)) return customerNotFound();
    const parsed = trendsQuerySchema.safeParse(
      Object.fromEntries(new URL(request.url).searchParams),
    );
    if (!parsed.success)
      return HttpResponse.json({ error: 'Invalid trends query' }, { status: 400 });
    return HttpResponse.json({ trends: getTrends(parsed.data.months, customerId) });
  }),
  http.get(`*/api/customers/${CID}/transactions`, ({ request, params }) => {
    const customerId = String(params.customerId);
    if (!findDemoCustomer(customerId)) return customerNotFound();
    const parsed = transactionsQuerySchema.safeParse(
      Object.fromEntries(new URL(request.url).searchParams),
    );
    if (!parsed.success)
      return HttpResponse.json({ error: 'Invalid transaction query' }, { status: 400 });
    const { limit, offset, ...filters } = parsed.data;
    const transactions = filterTransactions(filters, customerId);
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
  http.get(`*/api/customers/${CID}/goals`, ({ params }) => {
    const customerId = String(params.customerId);
    if (!findDemoCustomer(customerId)) return customerNotFound();
    return HttpResponse.json(getGoals(customerId));
  }),
  http.get(`*/api/customers/${CID}/filters`, ({ params }) =>
    findDemoCustomer(String(params.customerId))
      ? HttpResponse.json(seed.filters)
      : customerNotFound(),
  ),
];
