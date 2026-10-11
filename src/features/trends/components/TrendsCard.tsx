import { Suspense, lazy } from 'react';
import { useTrends } from '../hooks';

const TrendsChart = lazy(() => import('./TrendsChart'));

export default function TrendsCard() {
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
      <h2 className="font-semibold mb-2">Monthly trends</h2>
      <Suspense fallback={<div className="skeleton h-48" />}>
        <TrendsChart data={data.trends} />
      </Suspense>
    </section>
  );
}
