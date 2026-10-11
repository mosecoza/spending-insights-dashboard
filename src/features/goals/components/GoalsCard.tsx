import { useGoals } from '../hooks';
import { zar } from '../../../lib/api';

export default function GoalsCard() {
  const { data, isLoading, isError } = useGoals();
  if (isLoading)
    return (
      <div className="card">
        <div className="skeleton h-24" />
      </div>
    );
  if (isError || !data)
    return (
      <div className="card" role="alert">
        Failed to load spending goals
      </div>
    );
  return (
    <section aria-label="Spending goals" className="card">
      <h2 className="font-semibold mb-2">Goals</h2>
      {data.goals.length === 0 && <p className="text-sm text-slate-500">No spending goals set.</p>}
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
