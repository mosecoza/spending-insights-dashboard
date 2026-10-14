import { Suspense, lazy } from 'react';
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
      <h2 className="font-semibold mb-2">By category • {zar(data.totalAmount)}</h2>
      <Suspense fallback={<ChartSkeleton label="Loading category spending chart" />}>
        <CategoryDonut data={data} />
      </Suspense>
      <table className="w-full text-sm mt-3">
        <caption className="sr-only">Spending totals by category</caption>
        <thead>
          <tr className="text-left text-slate-500">
            <th scope="col">Category</th>
            <th scope="col">Amount</th>
            <th scope="col">%</th>
            <th scope="col">Transactions</th>
          </tr>
        </thead>
        <tbody>
          {data.categories.map((c) => (
            <tr key={c.name} className="border-t">
              <td>
                <CategoryIcon name={c.icon} className="inline size-4" style={{ color: c.color }} />{' '}
                {c.name}
              </td>
              <td>{zar(c.amount)}</td>
              <td>{c.percentage}%</td>
              <td>{c.transactionCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
