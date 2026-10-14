import { useGoals } from '../hooks';
import { zar } from '../../../lib/api';
import { CardSkeleton, EmptyState, QueryError } from '../../../components/StateViews';

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
      <h2 className="font-semibold mb-2">Goals</h2>
      {data.goals.length === 0 && (
        <EmptyState
          title="No spending goals set."
          hint="Goals appear once monthly budgets are available."
        />
      )}
      {data.goals.map((g) => (
        <div key={g.id} className="mb-3">
          <div className="flex justify-between text-sm">
            <span>{g.category}</span>
            <span>
              {zar(g.currentSpent)} / {zar(g.monthlyBudget)} • {g.status}
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={Math.min(Math.round(g.percentageUsed), 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${g.category} budget used`}
            className="h-2 bg-slate-200 rounded"
          >
            <div
              className={`h-2 rounded ${g.status === 'over_budget' ? 'bg-red-600' : g.status === 'warning' ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(g.percentageUsed, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">{g.daysRemaining} days remaining</p>
        </div>
      ))}
    </section>
  );
}
