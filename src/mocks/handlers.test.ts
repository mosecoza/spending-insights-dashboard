import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('customer profile handler', () => {
  it('echoes the customer ID from the request path', async () => {
    const response = await fetch('http://localhost/api/customers/67890/profile');

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ customerId: '67890' });
  });

  it('returns customer-specific transaction data', async () => {
    const query = 'limit=1&offset=0&sortBy=date_desc';
    const [defaultResponse, alternateResponse] = await Promise.all([
      fetch(`http://localhost/api/customers/12345/transactions?${query}`),
      fetch(`http://localhost/api/customers/67890/transactions?${query}`),
    ]);
    const defaultData = (await defaultResponse.json()) as {
      transactions: Array<{ id: string; amount: number }>;
    };
    const alternateData = (await alternateResponse.json()) as {
      transactions: Array<{ id: string; amount: number }>;
    };

    expect(defaultData.transactions[0].id).not.toBe(alternateData.transactions[0].id);
    expect(defaultData.transactions[0].amount).not.toBe(alternateData.transactions[0].amount);
  });

  it.each([
    'profile',
    'spending/summary',
    'spending/categories',
    'spending/trends',
    'transactions',
    'goals',
    'filters',
  ])('returns 404 for unknown customer IDs at /%s', async (resource) => {
    const response = await fetch(`http://localhost/api/customers/99999/${resource}`);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: 'Customer not found' });
  });
});
