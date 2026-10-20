import { UI_STRINGS } from '../../../constants/copy';
import { useSummary } from '../hooks';
import { zar } from '../../../lib/api';
import type { ComparedToPrevious } from '../../../types/api';
import { CardSkeleton, QueryError } from '../../../components/StateViews';

export function SummaryComparison({
  spentChange,
  transactionChange,
  hasComparison,
}: {
  spentChange: number;
  transactionChange: number;
  hasComparison: boolean;
}) {
  if (!hasComparison) {
    return (
      <div className="gradient-surface-dark text-inverse rounded-2xl p-4 shadow-md flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-subtle">Comparison unavailable</span>
      </div>
    );
  }
  if (spentChange === 0 && transactionChange === 0) {
    return (
      <div className="gradient-surface-dark text-inverse rounded-2xl p-4 shadow-md flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-subtle">{UI_STRINGS.summary.spendUnchanged}</span>
      </div>
    );
  }
  const isSpentLess = spentChange < 0;
  const formattedSpent = `${Math.abs(spentChange)}%`;

  return (
    <div className="gradient-surface-dark text-inverse rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center flex-wrap gap-x-3 gap-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          {UI_STRINGS.summary.comparisonPrefix}
        </span>
        <div className="flex items-center flex-wrap gap-2 text-sm font-medium">
          {spentChange === 0 ? (
            <span className="text-subtle">{UI_STRINGS.summary.spendUnchanged}</span>
          ) : (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isSpentLess
                  ? 'bg-success-default-20 text-success-light'
                  : 'bg-danger-default-20 text-danger-light'
              }`}
            >
              {isSpentLess
                ? UI_STRINGS.summary.lessSpent(formattedSpent)
                : UI_STRINGS.summary.moreSpent(formattedSpent)}
            </span>
          )}
          <span className="text-muted" aria-hidden="true">
            •
          </span>
          <span className="text-subtle">
            {UI_STRINGS.summary.txnChange(
              `${transactionChange > 0 ? '+' : ''}${transactionChange}%`,
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

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
  // Runtime guard: the API contract requires comparedToPrevious, but a stale
  // cache or contract drift could omit it. Never crash on nested access.
  const rawComparison = (data as unknown as { comparedToPrevious?: ComparedToPrevious })
    .comparedToPrevious;
  const compared = rawComparison ?? { spentChange: 0, transactionChange: 0 };
  const hasComparison = rawComparison !== undefined;
  const cards = [
    { label: UI_STRINGS.summary.totalSpent, value: zar(data.totalSpent) },
    { label: UI_STRINGS.summary.transactionCount, value: String(data.transactionCount) },
    { label: UI_STRINGS.summary.averageTxn, value: zar(data.averageTransaction) },
    { label: UI_STRINGS.summary.topCategory, value: data.topCategory },
  ];
  return (
    <section aria-label="Spending summary" aria-busy={isFetching} className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{c.label}</p>
            <p className="text-lg font-bold text-default mt-1">{c.value}</p>
          </div>
        ))}
      </div>
      <SummaryComparison
        spentChange={compared.spentChange}
        transactionChange={compared.transactionChange}
        hasComparison={hasComparison}
      />
    </section>
  );
}
