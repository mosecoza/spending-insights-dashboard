import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../../lib/api';
import { getTransactions } from '../api';

describe('transactions API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('validates pagination, filters, and sort before requesting rows', () => {
    const get = vi.spyOn(api, 'get').mockReturnValue(new Promise(() => undefined));
    void getTransactions({
      limit: 50,
      offset: 100,
      category: 'Groceries',
      startDate: '2024-08-01',
      endDate: '2024-08-31',
      sortBy: 'amount_desc',
    });
    expect(get).toHaveBeenCalledWith('/customers/12345/transactions', {
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
});
