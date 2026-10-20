import { useState } from 'react';
import {
  DEMO_DATE_ANCHOR,
  DEMO_FIXTURE_START_DATE,
  DEFAULT_DATE_RANGE,
} from '../../../lib/dateRange';
import { dateRangeSchema, fixtureDateSchema } from '../../../lib/validation';
import { useFilters } from '../../../store/useFilters';
import { UI_STRINGS } from '../../../constants/copy';

export default function DateRangePicker() {
  const { startDate, endDate, set } = useFilters();
  const [error, setError] = useState('');

  function updateRange(nextStart: string | undefined, nextEnd: string | undefined) {
    const start = nextStart || undefined;
    const end = nextEnd || undefined;
    const startResult = start ? fixtureDateSchema.safeParse(start) : undefined;
    const endResult = end ? fixtureDateSchema.safeParse(end) : undefined;
    if ((startResult && !startResult.success) || (endResult && !endResult.success)) {
      setError(`Dates must be between ${DEMO_FIXTURE_START_DATE} and ${DEMO_DATE_ANCHOR}.`);
      return;
    }

    const result = dateRangeSchema.safeParse({ startDate: start, endDate: end });
    if (!result.success) {
      setError('End date must be on or after start date.');
      return;
    }

    setError('');
    if (!start && !end) {
      set({ ...DEFAULT_DATE_RANGE, page: 0 });
      return;
    }
    set({ startDate: start, endDate: end, page: 0 });
  }

  return (
    <fieldset className="card flex flex-wrap items-end gap-3">
      <legend className="sr-only">{UI_STRINGS.filters.dateRangeLabel}</legend>
      <span className="w-full text-xs font-semibold uppercase tracking-wider text-muted">
        {UI_STRINGS.filters.dateRangeLabel}
      </span>
      <label className="flex flex-col gap-1 text-sm font-medium text-secondary">
        <span>{UI_STRINGS.filters.from}</span>
        <input
          aria-label="Start date"
          aria-invalid={Boolean(error)}
          type="date"
          min={DEMO_FIXTURE_START_DATE}
          max={endDate ?? DEMO_DATE_ANCHOR}
          value={startDate ?? ''}
          onChange={(event) => updateRange(event.target.value, endDate ?? '')}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-secondary">
        <span>{UI_STRINGS.filters.to}</span>
        <input
          aria-label="End date"
          aria-invalid={Boolean(error)}
          type="date"
          min={startDate ?? DEMO_FIXTURE_START_DATE}
          value={endDate ?? ''}
          onChange={(event) => updateRange(startDate ?? '', event.target.value)}
          max={DEMO_DATE_ANCHOR}
        />
      </label>
      <button
        type="button"
        className="px-4 py-1.5 border border-border-default rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow disabled:opacity-40 bg-surface-white"
        disabled={!startDate && !endDate}
        onClick={() => {
          setError('');
          set({ ...DEFAULT_DATE_RANGE, page: 0 });
        }}
      >
        {UI_STRINGS.filters.clearDates}
      </button>
      {error && (
        <p className="w-full text-sm text-error-default" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
