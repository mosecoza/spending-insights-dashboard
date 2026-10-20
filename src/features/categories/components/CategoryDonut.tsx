import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { CategoriesResponse } from 'Types/api';

export default function CategoryDonut({ data }: { data: CategoriesResponse }) {
  return (
    <div role="img" aria-label={`Spending by category, total ${data.totalAmount}`}>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data.categories}
            dataKey="amount"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
          >
            {data.categories.map((c) => (
              <Cell key={c.name} fill={c.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
