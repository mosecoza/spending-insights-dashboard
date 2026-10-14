import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../../lib/api';
import { getTrends } from '../api';

describe('trends API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('requests the selected number of months', () => {
    const get = vi.spyOn(api, 'get').mockReturnValue(new Promise(() => undefined));
    void getTrends('67890', 24);
    expect(get).toHaveBeenCalledWith('/customers/67890/spending/trends', {
      params: { months: 24 },
    });
  });
});
