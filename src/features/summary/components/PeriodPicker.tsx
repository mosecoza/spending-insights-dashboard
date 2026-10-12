import { useFilters } from '../../../store/useFilters';

export default function PeriodPicker() {
  const { period, set } = useFilters();
  const periods = ['7d', '30d', '90d', '1y'] as const;
  function selectPeriod(nextPeriod: (typeof periods)[number]) {
    set({ period: nextPeriod, startDate: undefined, endDate: undefined, page: 0 });
  }

  return (
    <div role="tablist" aria-label="Period" className="flex gap-2">
      {periods.map((p, index) => (
        <button
          key={p}
          id={`period-${p}`}
          role="tab"
          aria-selected={period === p}
          tabIndex={period === p ? 0 : -1}
          className={`px-3 py-1 rounded-full border ${period === p ? 'bg-slate-900 text-white' : 'bg-white'}`}
          onClick={() => selectPeriod(p)}
          onKeyDown={(event) => {
            const nextIndex =
              event.key === 'ArrowRight'
                ? (index + 1) % periods.length
                : event.key === 'ArrowLeft'
                  ? (index - 1 + periods.length) % periods.length
                  : event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? periods.length - 1
                      : -1;
            if (nextIndex >= 0) {
              event.preventDefault();
              const nextPeriod = periods[nextIndex];
              selectPeriod(nextPeriod);
              document.getElementById(`period-${nextPeriod}`)?.focus();
            }
          }}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
