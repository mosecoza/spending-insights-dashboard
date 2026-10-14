import { useSummary } from '../hooks';
import { zar } from '../../../lib/api';
import { CardSkeleton, QueryError } from '../../../components/StateViews';

export default function SummaryCards() {
  const { data, isLoading, isError, refetch, isFetching } = useSummary();
  if (isLoading) return <CardSkeleton label="Loading spending summary" variant="summary" />;
  if (isError || !data)
    return (
      <QueryError
        title="Failed to load spending summary"
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  const cards = [
    { label: 'Total spent', value: zar(data.totalSpent) },
    { label: 'Transactions', value: String(data.transactionCount) },
    { label: 'Average', value: zar(data.averageTransaction) },
    { label: 'Top category', value: data.topCategory },
  ];
  return (
    <section
      aria-label="Spending summary"
      aria-busy={isFetching}
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {cards.map((c) => (
        <div key={c.label} className="card">
          <p className="text-xs text-slate-500">{c.label}</p>
          <p className="text-lg font-bold">{c.value}</p>
        </div>
      ))}
      <div className="card col-span-2 md:col-span-4 text-sm">
        vs previous:{' '}
        <b className={data.comparedToPrevious.spentChange >= 0 ? 'text-red-600' : 'text-green-600'}>
          {data.comparedToPrevious.spentChange}% spent
        </b>
        {' • '}
        {data.comparedToPrevious.transactionChange}% transactions
      </div>
    </section>
  );
}
