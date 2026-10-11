import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../../lib/api';
import { getGoals } from '../api';

describe('goals API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('requests the customer goals endpoint', () => {
    const get = vi.spyOn(api, 'get').mockReturnValue(new Promise(() => undefined));
    void getGoals();
    expect(get).toHaveBeenCalledWith('/customers/12345/goals');
  });
});
