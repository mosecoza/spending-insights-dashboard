import { UI_STRINGS } from '../../../constants/copy';
import { useFilters } from '../../../store/useFilters';
import type { Period } from '../../../types/api';

export default function PeriodPicker() {
  const { period, set } = useFilters();
  const periods = ['7d', '30d', '90d', '1y'] as const;
  function selectPeriod(nextPeriod: (typeof periods)[number]) {
    set({ period: nextPeriod, startDate: undefined, endDate: undefined, page: 0 });
  }

  return (
    <div role="tablist" aria-label="Period" className="flex flex-wrap gap-2">
      {periods.map((p, index) => (
        <button
          key={p}
          id={`period-${p}`}
          role="tab"
          aria-selected={period === p}
          tabIndex={period === p ? 0 : -1}
          className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-shadow shadow-sm hover:shadow-md ${
            period === p
              ? 'bg-surface-dark text-inverse border-border-dark'
              : 'bg-surface-white text-secondary border-border-default hover:border-border-default'
          }`}
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
          {UI_STRINGS.filters.presets[p as Period] ?? p}
        </button>
      ))}
    </div>
  );
}
