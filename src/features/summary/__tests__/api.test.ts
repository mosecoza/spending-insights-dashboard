import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from 'Lib/api';
import { createAxiosResponse } from 'Lib/testUtils';
import { getSummary } from '../api';

describe('summary API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('validates and sends the selected period', async () => {
    const payload = {
      period: '90d',
      totalSpent: 100,
      transactionCount: 2,
      averageTransaction: 50,
      topCategory: 'Groceries',
      comparedToPrevious: { spentChange: 1.5, transactionChange: 0 },
    };
    const get = vi.spyOn(api, 'get').mockResolvedValue(createAxiosResponse(payload));
    await expect(getSummary('67890', '90d')).resolves.toEqual(payload);
    expect(get).toHaveBeenCalledWith('/customers/67890/spending/summary', {
      params: { period: '90d' },
    });
  });

  it('rejects a payload missing comparedToPrevious', async () => {
    const { comparedToPrevious: _omitted, ...partial } = {
      period: '30d',
      totalSpent: 100,
      transactionCount: 2,
      averageTransaction: 50,
      topCategory: 'Groceries',
      comparedToPrevious: { spentChange: 1.5, transactionChange: 0 },
    };
    void _omitted;
    vi.spyOn(api, 'get').mockResolvedValue(createAxiosResponse(partial));

    await expect(getSummary('12345', '30d')).rejects.toThrow();
  });
});
