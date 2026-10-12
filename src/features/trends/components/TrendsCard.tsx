import { Suspense, lazy } from 'react';
import { useTrends } from '../hooks';
import { useFilters } from '../../../store/useFilters';
import { trendsQuerySchema } from '../../../lib/validation';

const TrendsChart = lazy(() => import('./TrendsChart'));

export default function TrendsCard() {
  const months = useFilters((state) => state.months);
  const set = useFilters((state) => state.set);
  const { data, isLoading, isError } = useTrends();
  if (isLoading)
    return (
      <div className="card">
        <div className="skeleton h-48" />
      </div>
    );
  if (isError || !data)
    return (
      <div className="card" role="alert">
        Failed to load spending trends
      </div>
    );
  if (data.trends.length === 0)
    return (
      <section aria-label="Monthly trends" className="card">
        No trend data available.
      </section>
    );
  return (
    <section aria-label="Monthly trends" className="card">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">Monthly trends</h2>
        <label className="flex items-center gap-2 text-sm">
          <span>Months</span>
          <select
            aria-label="Trend months"
            value={months}
            onChange={(event) => {
              const nextMonths = trendsQuerySchema.shape.months.parse(event.target.value);
              set({ months: nextMonths });
            }}
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </label>
      </div>
      <Suspense fallback={<div className="skeleton h-48" />}>
        <TrendsChart data={data.trends} />
      </Suspense>
    </section>
  );
}
