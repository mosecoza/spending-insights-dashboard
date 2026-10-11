import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../../lib/api';
import { getProfile } from '../api';

describe('profile API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('requests the configured customer profile endpoint', () => {
    const get = vi.spyOn(api, 'get').mockReturnValue(new Promise(() => undefined));
    void getProfile();
    expect(get).toHaveBeenCalledWith('/customers/12345/profile');
  });
});
