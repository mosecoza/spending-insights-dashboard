import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../../lib/api';
import { getSummary } from '../api';

describe('summary API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('validates and sends the selected period', () => {
    const get = vi.spyOn(api, 'get').mockReturnValue(new Promise(() => undefined));
    void getSummary('90d');
    expect(get).toHaveBeenCalledWith('/customers/12345/spending/summary', {
      params: { period: '90d' },
    });
  });
});
