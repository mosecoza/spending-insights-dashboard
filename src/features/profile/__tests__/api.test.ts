import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../../lib/api';
import { createAxiosResponse } from '../../../lib/testUtils';
import { getProfile } from '../api';

describe('profile API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('requests the selected customer profile endpoint with a safe path segment', async () => {
    const payload = {
      customerId: '67890',
      name: 'Ayesha Khan',
      email: 'ayesha@example.com',
      joinDate: '2022-01-01',
      accountType: 'Premium',
      totalSpent: 100,
      currency: 'ZAR',
    };
    const get = vi.spyOn(api, 'get').mockResolvedValue(createAxiosResponse(payload));
    await expect(getProfile('customer/67890')).resolves.toEqual(payload);
    expect(get).toHaveBeenCalledWith('/customers/customer%2F67890/profile');
  });

  it('rejects a profile payload missing required fields', async () => {
    vi.spyOn(api, 'get').mockResolvedValue(createAxiosResponse({ customerId: '67890' }));

    await expect(getProfile('67890')).rejects.toThrow();
  });
});
