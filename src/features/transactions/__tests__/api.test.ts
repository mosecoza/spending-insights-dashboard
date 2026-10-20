import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from 'Lib/api';
import { createAxiosResponse } from 'Lib/testUtils';
import { getFilterMeta, getTransactions } from '../api';

describe('transactions API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('validates pagination, filters, and sort before requesting rows', async () => {
    const payload = {
      transactions: [
        {
          id: 'txn_1',
          date: '2024-08-01T12:00:00.000Z',
          merchant: 'Pick n Pay',
          category: 'Groceries',
          amount: 100,
          description: 'Groceries purchase',
          paymentMethod: 'Debit Card',
          icon: 'cart',
          categoryColor: '#000',
        },
      ],
      pagination: { total: 1, limit: 50, offset: 100, hasMore: false },
    };
    const get = vi.spyOn(api, 'get').mockResolvedValue(createAxiosResponse(payload));
    await expect(
      getTransactions({
        customerId: '67890',
        limit: 50,
        offset: 100,
        category: 'Groceries',
        startDate: '2024-08-01',
        endDate: '2024-08-31',
        sortBy: 'amount_desc',
      }),
    ).resolves.toEqual(payload);
    expect(get).toHaveBeenCalledWith('/customers/67890/transactions', {
      params: {
        limit: 50,
        offset: 100,
        category: 'Groceries',
        startDate: '2024-08-01',
        endDate: '2024-08-31',
        sortBy: 'amount_desc',
      },
    });
  });

  it('omits incomplete ranges and rejects dates outside fixture bounds', async () => {
    const payload = {
      transactions: [],
      pagination: { total: 0, limit: 20, offset: 0, hasMore: false },
    };
    const get = vi.spyOn(api, 'get').mockResolvedValue(createAxiosResponse(payload));
    await getTransactions({
      customerId: '67890',
      limit: 20,
      offset: 0,
      startDate: '2024-09-01',
      sortBy: 'date_desc',
    });

    expect(get).toHaveBeenCalledWith('/customers/67890/transactions', {
      params: { limit: 20, offset: 0, sortBy: 'date_desc' },
    });
    await expect(
      getTransactions({
        customerId: '67890',
        limit: 20,
        offset: 0,
        endDate: '2024-09-16',
        startDate: '2020-12-31',
        sortBy: 'date_desc',
      }),
    ).rejects.toThrow();
    expect(get).toHaveBeenCalledTimes(1);
  });

  it('rejects a transactions payload missing pagination', async () => {
    vi.spyOn(api, 'get').mockResolvedValue(createAxiosResponse({ transactions: [] }));

    await expect(
      getTransactions({ customerId: '67890', limit: 20, offset: 0, sortBy: 'date_desc' }),
    ).rejects.toThrow();
  });

  it('requests filter metadata for the selected customer', async () => {
    const payload = {
      categories: [{ name: 'Groceries', color: '#000', icon: 'cart' }],
      dateRangePresets: [{ label: 'Last 30 days', value: '30d' }],
    };
    const get = vi.spyOn(api, 'get').mockResolvedValue(createAxiosResponse(payload));
    await expect(getFilterMeta('67890')).resolves.toEqual(payload);
    expect(get).toHaveBeenCalledWith('/customers/67890/filters');
  });

  it('rejects filter metadata missing the category list', async () => {
    vi.spyOn(api, 'get').mockResolvedValue(createAxiosResponse({}));

    await expect(getFilterMeta('67890')).rejects.toThrow();
  });
});
