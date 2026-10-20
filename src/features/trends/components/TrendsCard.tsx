import { Suspense, lazy } from 'react';
import { UI_STRINGS } from 'Constants/copy';
import { useTrends } from '../hooks';
import { useFilters } from 'Store/useFilters';
import { trendsQuerySchema } from 'Lib/validation';
import { CardSkeleton, ChartSkeleton, EmptyState, QueryError } from 'Components/StateViews';

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
      <div className="flex justify-between items-center gap-2 mb-3">
        <h2 className="font-semibold text-default">{UI_STRINGS.trends.title}</h2>
        <label className="flex items-center gap-2 text-sm font-medium text-secondary">
          <span>{UI_STRINGS.trends.monthsLabel}</span>
          <select
            aria-label="Trend months"
            value={months}
            onChange={(event) => {
              const nextMonths = trendsQuerySchema.shape.months.parse(event.target.value);
              set({ months: nextMonths });
            }}
            className="rounded-xl border border-border-default bg-surface-white px-2 py-1 shadow-sm text-sm focus:outline-none focus:ring-2 ring-surface-dark-10"
          >
            <option value={6}>6 {UI_STRINGS.trends.monthsSuffix}</option>
            <option value={12}>12 {UI_STRINGS.trends.monthsSuffix}</option>
            <option value={24}>24 {UI_STRINGS.trends.monthsSuffix}</option>
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
