import { useProfile } from '../hooks';
import { zar } from '../../../lib/api';
import { demoCustomerOptions } from '../../../lib/demoCustomers';
import { useFilters } from '../../../store/useFilters';

export default function ProfileHeader() {
  const { data, isLoading, isError } = useProfile();
  const customerId = useFilters((state) => state.customerId);
  const setCustomerId = useFilters((state) => state.setCustomerId);
  if (isLoading)
    return (
      <div className="card">
        <div className="skeleton h-6 w-48" />
      </div>
    );
  if (isError || !data)
    return (
      <div className="card" role="alert">
        Failed to load profile
      </div>
    );
  return (
    <header className="card flex flex-wrap justify-between items-center gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <h1 className="text-xl font-bold">{data.name}</h1>
          <p className="text-sm text-slate-500">
            {data.accountType} • joined {data.joinDate}
          </p>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600" htmlFor="customer-switcher">
            Customer
          </label>
          <select
            className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
            id="customer-switcher"
            onChange={(event) => setCustomerId(event.target.value)}
            value={customerId}
          >
            {demoCustomerOptions.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-500">Total spent</p>
        <p className="text-xl font-bold">{zar(data.totalSpent)}</p>
      </div>
    </header>
  );
}
