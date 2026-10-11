import { useSummary } from '../hooks';
import { zar } from '../../../lib/api';

export default function SummaryCards() {
  const { data, isLoading, isError } = useSummary();
  if (isLoading)
    return <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[0, 1, 2, 3].map((i) => <div key={i} className="card"><div className="skeleton h-8" /></div>)}</div>;
  if (isError || !data) return <div className="card" role="alert">Failed to load spending summary</div>;
  const cards = [
    { label: 'Total spent', value: zar(data.totalSpent) },
    { label: 'Transactions', value: String(data.transactionCount) },
    { label: 'Average', value: zar(data.averageTransaction) },
    { label: 'Top category', value: data.topCategory },
  ];
  return (
    <section aria-label="Spending summary" className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="card"><p className="text-xs text-slate-500">{c.label}</p><p className="text-lg font-bold">{c.value}</p></div>
      ))}
      <div className="card col-span-2 md:col-span-4 text-sm">
        vs previous: <b className={data.comparedToPrevious.spentChange >= 0 ? 'text-red-600' : 'text-green-600'}>{data.comparedToPrevious.spentChange}% spent</b>
        {' • '}{data.comparedToPrevious.transactionChange}% transactions
      </div>
    </section>
  );
}
