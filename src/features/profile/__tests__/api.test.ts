import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../../lib/api';
import { getProfile } from '../api';

describe('profile API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('requests the selected customer profile endpoint with a safe path segment', () => {
    const get = vi.spyOn(api, 'get').mockReturnValue(new Promise(() => undefined));
    void getProfile('customer/67890');
    expect(get).toHaveBeenCalledWith('/customers/customer%2F67890/profile');
  });
});
