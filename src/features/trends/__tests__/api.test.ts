import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../../lib/api';
import { createAxiosResponse } from '../../../lib/testUtils';
import { getTrends } from '../api';

describe('trends API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('requests the selected number of months', async () => {
    const payload = {
      trends: [{ month: '2024-08', totalSpent: 100, transactionCount: 2, averageTransaction: 50 }],
    };
    const get = vi.spyOn(api, 'get').mockResolvedValue(createAxiosResponse(payload));
    await expect(getTrends('67890', 24)).resolves.toEqual(payload);
    expect(get).toHaveBeenCalledWith('/customers/67890/spending/trends', {
      params: { months: 24 },
    });
  });

  it('rejects a trends payload missing the trends list', async () => {
    vi.spyOn(api, 'get').mockResolvedValue(createAxiosResponse({}));

    await expect(getTrends('67890', 12)).rejects.toThrow();
  });
});
