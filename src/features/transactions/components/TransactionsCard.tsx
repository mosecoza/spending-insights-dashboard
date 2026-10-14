import { useEffect } from 'react';
import { useTransactions, useFilterMeta } from '../hooks';
import { useFilters } from '../../../store/useFilters';
import { zar } from '../../../lib/api';
import { categorySchema, sortBySchema, transactionLimitSchema } from '../../../lib/validation';
import { CategoryIcon } from '../../../lib/categoryIcons';
import { CardSkeleton, EmptyState, QueryError } from '../../../components/StateViews';

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
      <div className="flex flex-wrap gap-2 mb-3">
        <select
          aria-label="Filter by category"
          value={category ?? ''}
          onChange={(e) => {
            const nextCategory = e.target.value ? categorySchema.parse(e.target.value) : undefined;
            set({ category: nextCategory, page: 0 });
          }}
        >
          <option value="">All categories</option>
          {(meta?.categories ?? []).map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Sort"
          value={sortBy}
          onChange={(e) => set({ sortBy: sortBySchema.parse(e.target.value), page: 0 })}
        >
          <option value="date_desc">Newest</option>
          <option value="date_asc">Oldest</option>
          <option value="amount_desc">Amount high</option>
          <option value="amount_asc">Amount low</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <span>Rows per page</span>
          <select
            aria-label="Rows per page"
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
        <div role="alert" className="mb-3 text-sm text-red-700">
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
            title="No transactions match these filters."
            hint="Try clearing the category or custom date range."
            actionLabel="Clear filters"
            onAction={clearTransactionFilters}
          />
        </div>
      ) : (
        <table className="w-full text-sm">
          <caption className="sr-only">Transactions for the selected filters</caption>
          <thead>
            <tr className="text-left text-slate-500">
              <th scope="col">Date</th>
              <th scope="col">Merchant</th>
              <th scope="col">Category</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.map((t) => (
              <tr
                key={t.id}
                tabIndex={0}
                className="border-t focus-visible:outline focus-visible:outline-2"
              >
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.merchant}</td>
                <td>
                  <CategoryIcon
                    name={t.icon}
                    className="inline size-4"
                    style={{ color: t.categoryColor }}
                  />{' '}
                  {t.category}
                </td>
                <td>{zar(t.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {data.transactions.length > 0 && (
        <div className="flex gap-2 mt-3 items-center">
          <button
            disabled={page === 0}
            onClick={() => set({ page: page - 1 })}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {page + 1} of {totalPages} • {data.pagination.total} total
          </span>
          <button
            disabled={!data.pagination.hasMore}
            onClick={() => set({ page: page + 1 })}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
