import { Suspense, lazy } from 'react';
import { UI_STRINGS } from '../../../constants/copy';
import { useCategories } from '../hooks';
import { zar } from '../../../lib/api';
import { CategoryIcon } from '../../../lib/categoryIcons';
import {
  CardSkeleton,
  ChartSkeleton,
  EmptyState,
  QueryError,
} from '../../../components/StateViews';

const CategoryDonut = lazy(() => import('./CategoryDonut'));

export default function CategoriesCard() {
  const { data, isLoading, isError, refetch, isFetching } = useCategories();
  if (isLoading)
    return <CardSkeleton label="Loading spending by category" variant="chart-table" rows={6} />;
  if (isError || !data)
    return (
      <QueryError
        title="Failed to load categories"
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  if (data.categories.length === 0 || data.totalAmount === 0)
    return (
      <section aria-label="Spending by category" aria-busy={isFetching} className="card">
        <EmptyState
          title="No category spending for this period."
          hint="Try a longer period or clear the custom date range."
        />
      </section>
    );
  return (
    <section aria-label="Spending by category" aria-busy={isFetching} className="card">
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <h2 className="font-semibold text-default">{UI_STRINGS.categories.title}</h2>
        <p className="text-sm font-bold text-default">{zar(data.totalAmount)}</p>
      </div>
      <Suspense fallback={<ChartSkeleton label="Loading category spending chart" />}>
        <CategoryDonut data={data} />
      </Suspense>
      <table className="w-full text-sm mt-3">
        <caption className="sr-only">Spending totals by category</caption>
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-muted">
            <th scope="col" className="pb-2">
              {UI_STRINGS.categories.tableHeaderCategory}
            </th>
            <th scope="col" className="pb-2 text-right">
              {UI_STRINGS.categories.tableHeaderAmount}
            </th>
            <th scope="col" className="pb-2 text-right">
              {UI_STRINGS.categories.tableHeaderShare}
            </th>
            <th scope="col" className="pb-2 text-right">
              {UI_STRINGS.categories.tableHeaderCount}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {data.categories.map((c) => (
            <tr key={c.name} className="hover:bg-surface-subtle-80 transition-colors">
              <td className="py-2 font-medium text-default">
                <CategoryIcon name={c.icon} className="inline size-4" style={{ color: c.color }} />{' '}
                {c.name}
              </td>
              <td className="py-2 text-right font-semibold">{zar(c.amount)}</td>
              <td className="py-2 text-right text-secondary">{c.percentage}%</td>
              <td className="py-2 text-right text-secondary">{c.transactionCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
