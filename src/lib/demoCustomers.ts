import { DEFAULT_CUSTOMER_ID } from './api';
import type { CustomerProfile } from '../types/api';

export interface DemoCustomer extends CustomerProfile {
  transactionVariant: number;
}

export const demoCustomers: readonly DemoCustomer[] = [
  {
    customerId: DEFAULT_CUSTOMER_ID,
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: '2023-01-15',
    accountType: 'premium',
    totalSpent: 15420.5,
    currency: 'ZAR',
    transactionVariant: 0,
  },
  {
    customerId: '67890',
    name: 'Ayesha Khan',
    email: 'ayesha.khan@example.com',
    joinDate: '2022-08-04',
    accountType: 'standard',
    totalSpent: 11980.75,
    currency: 'ZAR',
    transactionVariant: 1,
  },
  {
    customerId: '24680',
    name: 'David Smith',
    email: 'david.smith@example.com',
    joinDate: '2024-02-19',
    accountType: 'premium',
    totalSpent: 18765.25,
    currency: 'ZAR',
    transactionVariant: 2,
  },
] as const;

export const demoCustomerOptions = demoCustomers.map(({ customerId, name }) => ({
  id: customerId,
  name,
}));

export function findDemoCustomer(customerId: string) {
  return demoCustomers.find((customer) => customer.customerId === customerId);
}
