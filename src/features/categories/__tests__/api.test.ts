import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../../lib/api';
import { getCategories } from '../api';

describe('categories API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('validates and sends period and custom date filters', async () => {
    const payload = {
      dateRange: { startDate: '2024-08-01', endDate: '2024-08-31' },
      totalAmount: 100,
      categories: [
        {
          name: 'Groceries',
          amount: 100,
          percentage: 100,
          transactionCount: 2,
          color: '#000',
          icon: 'cart',
        },
      ],
    };
    const get = vi.spyOn(api, 'get').mockResolvedValue({ data: payload });
    await expect(
      getCategories({
        customerId: '67890',
        period: '30d',
        startDate: '2024-08-01',
        endDate: '2024-08-31',
      }),
    ).resolves.toEqual(payload);
    expect(get).toHaveBeenCalledWith('/customers/67890/spending/categories', {
      params: { period: '30d', startDate: '2024-08-01', endDate: '2024-08-31' },
    });
  });

  it('rejects a categories payload missing the category list', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: { totalAmount: 0 } });

    await expect(getCategories({ customerId: '67890', period: '30d' })).rejects.toThrow();
  });
});
