import { useEffect } from 'react';
import { UI_STRINGS } from 'Constants/copy';
import { useTransactions, useFilterMeta } from '../hooks';
import { useFilters } from 'Store/useFilters';
import { formatDateSA, zar } from 'Lib/api';
import { categorySchema, sortBySchema, transactionLimitSchema } from 'Lib/validation';
import { CategoryIcon } from 'Lib/categoryIcons';
import { CardSkeleton, EmptyState, QueryError } from 'Components/StateViews';

export default function TransactionsCard() {
  const { page, limit, category, sortBy, set } = useFilters();
  const { data, isLoading, isError, refetch, isFetching } = useTransactions();
  const {
    data: meta,
    isError: isMetaError,
    refetch: refetchMeta,
    isFetching: isMetaFetching,
  } = useFilterMeta();
  const totalPages = data ? Math.max(1, Math.ceil(data.pagination.total / limit)) : 1;

  useEffect(() => {
    if (data && page >= totalPages && page > 0) set({ page: totalPages - 1 });
  }, [data, page, set, totalPages]);

  if (isLoading) return <CardSkeleton label="Loading transactions" variant="table" rows={limit} />;
  if (isError || !data)
    return (
      <QueryError
        title="Failed to load transactions"
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  function clearTransactionFilters() {
    set({ category: undefined, startDate: undefined, endDate: undefined, page: 0 });
  }
  return (
    <section aria-label="Transactions" aria-busy={isFetching} className="card">
      <h2 className="font-semibold text-default mb-3">{UI_STRINGS.transactions.title}</h2>
      <div className="flex flex-wrap gap-2 mb-3">
        <select
          aria-label="Filter by category"
          className="rounded-xl border border-border-default bg-surface-white px-3 py-1.5 text-sm shadow-sm"
          value={category ?? ''}
          onChange={(e) => {
            const nextCategory = e.target.value ? categorySchema.parse(e.target.value) : undefined;
            set({ category: nextCategory, page: 0 });
          }}
        >
          <option value="">{UI_STRINGS.transactions.filterAll}</option>
          {(meta?.categories ?? []).map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Sort"
          className="rounded-xl border border-border-default bg-surface-white px-3 py-1.5 text-sm shadow-sm"
          value={sortBy}
          onChange={(e) => set({ sortBy: sortBySchema.parse(e.target.value), page: 0 })}
        >
          <option value="date_desc">{UI_STRINGS.transactions.sortNewest}</option>
          <option value="date_asc">{UI_STRINGS.transactions.sortOldest}</option>
          <option value="amount_desc">{UI_STRINGS.transactions.sortHighest}</option>
          <option value="amount_asc">{UI_STRINGS.transactions.sortLowest}</option>
        </select>
        <label className="flex items-center gap-2 text-sm font-medium text-secondary">
          <span>{UI_STRINGS.transactions.rowsPerPage}</span>
          <select
            aria-label="Rows per page"
            className="rounded-xl border border-border-default bg-surface-white px-2 py-1.5 shadow-sm"
            value={limit}
            onChange={(event) => {
              const nextLimit = transactionLimitSchema.parse(event.target.value);
              set({ limit: nextLimit, page: 0 });
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>
      {isMetaError && (
        <div role="alert" className="mb-3 text-sm text-error-default">
          <p>Could not load category filter options.</p>
          <button
            type="button"
            onClick={() => void refetchMeta()}
            disabled={isMetaFetching}
            className="mt-1 px-3 py-1 border rounded disabled:opacity-50"
          >
            {isMetaFetching ? 'Retrying…' : 'Retry category options'}
          </button>
        </div>
      )}
      {data.transactions.length === 0 ? (
        <div className="mt-2">
          <EmptyState
            title={UI_STRINGS.transactions.emptyState}
            hint={UI_STRINGS.transactions.emptyStateHint}
            actionLabel={UI_STRINGS.transactions.clearFilters}
            onAction={clearTransactionFilters}
          />
        </div>
      ) : (
        <table className="w-full text-sm">
          <caption className="sr-only">Transactions for the selected filters</caption>
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-muted">
              <th scope="col" className="pb-2">
                Date
              </th>
              <th scope="col" className="pb-2">
                Merchant
              </th>
              <th scope="col" className="pb-2">
                Category
              </th>
              <th scope="col" className="pb-2 text-right">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {data.transactions.map((t) => (
              <tr
                key={t.id}
                tabIndex={0}
                className="hover:bg-surface-subtle-80 transition-colors focus-visible:outline focus-visible:outline-2"
              >
                <td className="py-2 text-secondary">{formatDateSA(t.date)}</td>
                <td className="py-2 font-medium text-default">{t.merchant}</td>
                <td className="py-2 text-secondary">
                  <CategoryIcon
                    name={t.icon}
                    className="inline size-4"
                    style={{ color: t.categoryColor }}
                  />{' '}
                  {t.category}
                </td>
                <td className="py-2 text-right font-semibold text-default">{zar(t.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {data.transactions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 items-center">
          <button
            disabled={page === 0}
            onClick={() => set({ page: page - 1 })}
            className="px-4 py-1.5 border border-border-default rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow disabled:opacity-40 bg-surface-white"
          >
            Prev
          </button>
          <span className="text-sm text-secondary">
            {UI_STRINGS.transactions.paginationInfo(page + 1, totalPages, data.pagination.total)}
          </span>
          <button
            disabled={!data.pagination.hasMore}
            onClick={() => set({ page: page + 1 })}
            className="px-4 py-1.5 border border-border-default rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow disabled:opacity-40 bg-surface-white"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
