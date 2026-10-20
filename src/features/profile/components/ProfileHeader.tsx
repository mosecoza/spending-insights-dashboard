import { UI_STRINGS } from '../../../constants/copy';
import { useProfile } from '../hooks';
import { formatDateSA, zar } from '../../../lib/api';
import { demoCustomerOptions } from '../../../lib/demoCustomers';
import { useFilters } from '../../../store/useFilters';
import { CardSkeleton, QueryError } from '../../../components/StateViews';

export default function ProfileHeader() {
  const { data, isLoading, isError, refetch, isFetching } = useProfile();
  const customerId = useFilters((state) => state.customerId);
  const setCustomerId = useFilters((state) => state.setCustomerId);
  if (isLoading) return <CardSkeleton label="Loading customer profile" variant="list" rows={2} />;
  if (isError || !data)
    return (
      <QueryError
        title="Failed to load profile"
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  return (
    <header
      className="card flex flex-wrap justify-between items-center gap-4 gradient-surface-header"
      aria-busy={isFetching}
    >
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-default">{data.name}</h1>
          <p className="text-sm text-muted">{UI_STRINGS.header.welcomeSubtitle}</p>
          <p className="text-xs text-muted mt-0.5">
            {data.accountType} • joined {formatDateSA(data.joinDate)}
          </p>
        </div>
        <div className="space-y-1">
          <label
            className="block text-xs font-semibold uppercase tracking-wider text-muted"
            htmlFor="customer-switcher"
          >
            {UI_STRINGS.header.customerSelectLabel}
          </label>
          <select
            className="rounded-xl border border-border-default bg-surface-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 ring-surface-dark-10"
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
      <div className="text-right rounded-2xl bg-surface-dark text-inverse px-4 py-3 shadow-md">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          {UI_STRINGS.header.totalSpentBadge}
        </p>
        <p className="text-xl font-bold">{zar(data.totalSpent)}</p>
      </div>
    </header>
  );
}
