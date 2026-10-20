import { UI_STRINGS } from '../../../constants/copy';
import { useGoals } from '../hooks';
import { zar } from '../../../lib/api';
import type { GoalStatus } from '../../../types/api';
import { CardSkeleton, EmptyState, QueryError } from '../../../components/StateViews';

const statusStyles: Record<GoalStatus, { pill: string; dot: string; bar: string }> = {
  on_track: {
    pill: 'bg-success-subtle text-success-strong border-success-subtle',
    dot: 'bg-success-default',
    bar: 'bg-success-default',
  },
  warning: {
    pill: 'bg-warning-subtle text-warning-strong border-warning-subtle',
    dot: 'bg-warning-default',
    bar: 'bg-warning-default',
  },
  over_budget: {
    pill: 'bg-danger-subtle text-danger-strong border-danger-subtle',
    dot: 'bg-danger-default',
    bar: 'bg-danger-default',
  },
};

export function GoalBadge({ status }: { status: GoalStatus }) {
  const config = statusStyles[status] ?? statusStyles.on_track;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`} aria-hidden="true" />
      {UI_STRINGS.goals.status[status] ?? status}
    </span>
  );
}

export default function GoalsCard() {
  const { data, isLoading, isError, refetch, isFetching } = useGoals();
  if (isLoading) return <CardSkeleton label="Loading spending goals" variant="list" rows={6} />;
  if (isError || !data)
    return (
      <QueryError
        title="Failed to load spending goals"
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  return (
    <section aria-label="Spending goals" aria-busy={isFetching} className="card">
      <h2 className="font-semibold text-default mb-3">{UI_STRINGS.goals.title}</h2>
      {data.goals.length === 0 && (
        <EmptyState
          title="No spending goals set."
          hint="Goals appear once monthly budgets are available."
        />
      )}
      {data.goals.map((g) => (
        <div key={g.id} className="mb-4 rounded-2xl border border-border-subtle p-3 shadow-sm">
          <div className="flex justify-between items-center gap-2 text-sm">
            <span className="font-semibold text-default">{g.category}</span>
            <GoalBadge status={g.status} />
          </div>
          <div className="flex justify-between text-sm text-secondary mt-1">
            <span>
              {zar(g.currentSpent)} / {zar(g.monthlyBudget)}
            </span>
            <span>{Math.round(g.percentageUsed)}% used</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={Math.min(Math.round(g.percentageUsed), 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${g.category} budget used`}
            className="h-2 bg-border-subtle rounded-full mt-2 overflow-hidden"
          >
            <div
              className={`h-2 rounded-full ${statusStyles[g.status]?.bar ?? 'bg-success-default'}`}
              style={{ width: `${Math.min(g.percentageUsed, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted mt-1.5">
            {UI_STRINGS.goals.remainingDays(g.daysRemaining)}
          </p>
        </div>
      ))}
    </section>
  );
}
