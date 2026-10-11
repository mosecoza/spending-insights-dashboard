import { api, DEMO_CUSTOMER_ID } from '../../lib/api';
import type { CustomerProfile } from '../../types/api';

export async function getProfile() {
  return (await api.get<CustomerProfile>(`/customers/${DEMO_CUSTOMER_ID}/profile`)).data;
}
