import { Suspense, lazy } from 'react';
import { useTrends } from '../hooks';
import { useFilters } from '../../../store/useFilters';
import { trendsQuerySchema } from '../../../lib/validation';
import {
  CardSkeleton,
  ChartSkeleton,
  EmptyState,
  QueryError,
} from '../../../components/StateViews';

const TrendsChart = lazy(() => import('./TrendsChart'));

export default function TrendsCard() {
  const months = useFilters((state) => state.months);
  const set = useFilters((state) => state.set);
  const { data, isLoading, isError, refetch, isFetching } = useTrends();
  if (isLoading) return <CardSkeleton label="Loading monthly trends" variant="chart" />;
  if (isError || !data)
    return (
      <QueryError
        title="Failed to load spending trends"
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  return (
    <section aria-label="Monthly trends" aria-busy={isFetching} className="card">
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
      {data.trends.length === 0 ? (
        <EmptyState
          title="No trend data available."
          hint="Choose more months to see spending trends."
        />
      ) : (
        <Suspense fallback={<ChartSkeleton label="Loading monthly trends chart" />}>
          <TrendsChart data={data.trends} />
        </Suspense>
      )}
    </section>
  );
}
