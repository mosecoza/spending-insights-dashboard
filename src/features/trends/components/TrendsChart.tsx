import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { TrendPoint } from '../../../types/api';
import { zar } from '../../../lib/api';

export default function TrendsChart({ data }: { data: TrendPoint[] }) {
  return (
    <>
      <div role="img" aria-label={`Monthly spending trends for ${data.length} months`}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => zar(Number(value))} />
            <Line
              type="monotone"
              dataKey="totalSpent"
              stroke="#0f172a"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Monthly spending trend data</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Total spent</th>
            <th scope="col">Transactions</th>
            <th scope="col">Average transaction</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.month}>
              <th scope="row">{point.month}</th>
              <td>{zar(point.totalSpent)}</td>
              <td>{point.transactionCount}</td>
              <td>{zar(point.averageTransaction)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
