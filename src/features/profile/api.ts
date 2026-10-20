import { api, customerApiPath } from 'Lib/api';
import { customerProfileSchema } from 'Lib/validation';

export async function getProfile(customerId: string) {
  const response = await api.get(customerApiPath(customerId, 'profile'));
  return customerProfileSchema.parse(response.data);
}
