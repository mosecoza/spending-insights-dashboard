import { useFilters } from '../../../store/useFilters';

export default function PeriodPicker() {
  const { period, set } = useFilters();
  const periods = ['7d', '30d', '90d', '1y'] as const;
  return (
    <div role="tablist" aria-label="Period" className="flex gap-2">
      {periods.map((p) => (
        <button key={p} role="tab" aria-selected={period === p}
          className={`px-3 py-1 rounded-full border ${period === p ? 'bg-slate-900 text-white' : 'bg-white'}`}
          onClick={() => set({ period: p, startDate: undefined, endDate: undefined, page: 0 })}>{p}</button>
      ))}
    </div>
  );
}
