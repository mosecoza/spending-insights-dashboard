interface CardSkeletonProps {
  label: string;
  variant?: 'summary' | 'chart' | 'chart-table' | 'table' | 'list';
  rows?: number;
}

function ChartShape() {
  return (
    <>
      <div className="skeleton h-48 mt-3" />
      <div className="mt-3 space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-4 w-full" />
        ))}
      </div>
    </>
  );
}

export function ChartSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-label={label}>
      <div aria-hidden="true">
        <div className="skeleton h-48" />
      </div>
    </div>
  );
}

export function CardSkeleton({ label, variant = 'list', rows = 4 }: CardSkeletonProps) {
  if (variant === 'summary') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="status" aria-label={label}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-6 w-24 mt-2" />
          </div>
        ))}
        <div className="card col-span-2 md:col-span-4" aria-hidden="true">
          <div className="skeleton h-4 w-56" />
        </div>
      </div>
    );
  }

  if (variant === 'chart' || variant === 'chart-table') {
    return (
      <div className="card" role="status" aria-label={label}>
        <div className="skeleton h-5 w-48" />
        <div aria-hidden="true">
          {variant === 'chart' ? <ChartShape /> : <div className="skeleton h-48 mt-3" />}
          {variant === 'chart-table' && (
            <div className="mt-3 space-y-2">
              {Array.from({ length: rows }, (_, i) => (
                <div key={i} className="skeleton h-6 w-full" />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="card" role="status" aria-label={label}>
        <div className="skeleton h-5 w-40" />
        <div className="mt-3 space-y-2" aria-hidden="true">
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="skeleton h-6 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card" role="status" aria-label={label}>
      <div className="skeleton h-5 w-32" />
      <div className="mt-3 space-y-2" aria-hidden="true">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="skeleton h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

interface QueryErrorProps {
  title: string;
  detail?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function QueryError({ title, detail, onRetry, isRetrying = false }: QueryErrorProps) {
  return (
    <div className="card border-error-subtle" role="alert">
      <h2 className="font-semibold text-error-default">{title}</h2>
      <p className="text-sm text-secondary mt-1">
        {detail ?? 'Check your connection and try again.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-3 px-3 py-1 rounded bg-surface-dark text-inverse disabled:opacity-50"
      >
        {isRetrying ? 'Retrying…' : 'Try again'}
      </button>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, hint, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div aria-live="polite">
      <p className="text-sm font-medium text-secondary">{title}</p>
      {hint ? <p className="text-sm text-muted mt-1">{hint}</p> : null}
      {actionLabel && onAction ? (
        <button type="button" onClick={onAction} className="mt-3 px-3 py-1 border rounded">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
