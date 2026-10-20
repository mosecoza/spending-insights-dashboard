import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from 'Lib/api';
import { createAxiosResponse } from 'Lib/testUtils';
import { getGoals } from '../api';

describe('goals API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('requests the customer goals endpoint', async () => {
    const payload = {
      goals: [
        {
          id: 'goal_groceries',
          category: 'Groceries',
          monthlyBudget: 1000,
          currentSpent: 100,
          percentageUsed: 10,
          daysRemaining: 5,
          status: 'on_track',
        },
      ],
    };
    const get = vi.spyOn(api, 'get').mockResolvedValue(createAxiosResponse(payload));
    await expect(getGoals('67890')).resolves.toEqual(payload);
    expect(get).toHaveBeenCalledWith('/customers/67890/goals');
  });

  it('rejects a goals payload missing the goals list', async () => {
    vi.spyOn(api, 'get').mockResolvedValue(createAxiosResponse({}));

    await expect(getGoals('67890')).rejects.toThrow();
  });
});
