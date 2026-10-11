import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../../lib/api';
import { getCategories } from '../api';

describe('categories API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('validates and sends period and custom date filters', () => {
    const get = vi.spyOn(api, 'get').mockReturnValue(new Promise(() => undefined));
    void getCategories({ period: '30d', startDate: '2024-08-01', endDate: '2024-08-31' });
    expect(get).toHaveBeenCalledWith('/customers/12345/spending/categories', {
      params: { period: '30d', startDate: '2024-08-01', endDate: '2024-08-31' },
    });
  });
});
