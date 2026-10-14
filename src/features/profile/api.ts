import { api, customerApiPath } from '../../lib/api';
import type { CustomerProfile } from '../../types/api';

export async function getProfile(customerId: string) {
  return (await api.get<CustomerProfile>(customerApiPath(customerId, 'profile'))).data;
}
