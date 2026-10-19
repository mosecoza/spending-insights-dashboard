import { api, customerApiPath } from '../../lib/api';
import { customerProfileSchema } from '../../lib/validation';

export async function getProfile(customerId: string) {
  const response = await api.get(customerApiPath(customerId, 'profile'));
  return customerProfileSchema.parse(response.data);
}
