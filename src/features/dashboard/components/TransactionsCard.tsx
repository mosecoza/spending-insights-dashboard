import { useEffect } from 'react';
import { useTransactions, useFilterMeta } from '../hooks';
import { useFilters } from '../../../store/useFilters';
import { zar } from '../../../lib/api';
import { categorySchema, sortBySchema } from '../../../lib/validation';

export default function TransactionsCard() {
  const { page, limit, category, sortBy, set } = useFilters();
  const { data, isLoading, isError } = useTransactions();
  const { data: meta } = useFilterMeta();
  const totalPages = data ? Math.max(1, Math.ceil(data.pagination.total / limit)) : 1;

  useEffect(() => {
    if (data && page >= totalPages && page > 0) set({ page: totalPages - 1 });
  }, [data, page, set, totalPages]);

  if (isLoading) return <div className="card"><div className="skeleton h-64" /></div>;
  if (isError || !data) return <div className="card" role="alert">Failed to load transactions</div>;
  return (
    <section aria-label="Transactions" className="card">
      <div className="flex flex-wrap gap-2 mb-3">
        <select aria-label="Filter by category" value={category ?? ''} onChange={(e) => {
          const nextCategory = e.target.value ? categorySchema.parse(e.target.value) : undefined;
          set({ category: nextCategory, page: 0 });
        }}>
          <option value="">All categories</option>
          {(meta?.categories ?? []).map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        <select aria-label="Sort" value={sortBy} onChange={(e) => set({ sortBy: sortBySchema.parse(e.target.value), page: 0 })}>
          <option value="date_desc">Newest</option><option value="date_asc">Oldest</option>
          <option value="amount_desc">Amount high</option><option value="amount_asc">Amount low</option>
        </select>
      </div>
      <table className="w-full text-sm">
        <caption className="sr-only">Transactions for the selected filters</caption>
        <thead><tr className="text-left text-slate-500"><th scope="col">Date</th><th scope="col">Merchant</th><th scope="col">Category</th><th scope="col">Amount</th></tr></thead>
        <tbody>{data.transactions.map((t) => (
          <tr key={t.id} className="border-t"><td>{new Date(t.date).toLocaleDateString()}</td><td>{t.merchant}</td><td><span style={{ color: t.categoryColor }}>●</span> {t.category}</td><td>{zar(t.amount)}</td></tr>
        ))}</tbody>
      </table>
      {data.transactions.length === 0 && <p className="text-sm text-slate-500 mt-2">No transactions for this filter.</p>}
      <div className="flex gap-2 mt-3 items-center">
        <button disabled={page === 0} onClick={() => set({ page: page - 1 })} className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
        <span className="text-sm">Page {page + 1} of {totalPages} • {data.pagination.total} total</span>
        <button disabled={!data.pagination.hasMore} onClick={() => set({ page: page + 1 })} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
      </div>
    </section>
  );
}
