import { Suspense, lazy } from 'react';
import { useCategories } from '../hooks';
import { zar } from '../../../lib/api';
import { CategoryIcon } from '../../../lib/categoryIcons';

const CategoryDonut = lazy(() => import('./CategoryDonut'));

export default function CategoriesCard() {
  const { data, isLoading, isError } = useCategories();
  if (isLoading)
    return (
      <div className="card">
        <div className="skeleton h-48" />
      </div>
    );
  if (isError || !data)
    return (
      <div className="card" role="alert">
        Failed to load categories
      </div>
    );
  return (
    <section aria-label="Spending by category" className="card">
      <h2 className="font-semibold mb-2">By category • {zar(data.totalAmount)}</h2>
      <Suspense fallback={<div className="skeleton h-48" />}>
        <CategoryDonut data={data} />
      </Suspense>
      <table className="w-full text-sm mt-3">
        <caption className="sr-only">Spending totals by category</caption>
        <thead>
          <tr className="text-left text-slate-500">
            <th scope="col">Category</th>
            <th scope="col">Amount</th>
            <th scope="col">%</th>
            <th scope="col">Transactions</th>
          </tr>
        </thead>
        <tbody>
          {data.categories.map((c) => (
            <tr key={c.name} className="border-t">
              <td>
                <CategoryIcon name={c.icon} className="inline size-4" style={{ color: c.color }} />{' '}
                {c.name}
              </td>
              <td>{zar(c.amount)}</td>
              <td>{c.percentage}%</td>
              <td>{c.transactionCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
