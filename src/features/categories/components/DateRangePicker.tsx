import { useState } from 'react';
import { dateRangeSchema, dateSchema } from '../../../lib/validation';
import { useFilters } from '../../../store/useFilters';

export default function DateRangePicker() {
  const { startDate, endDate, set } = useFilters();
  const [error, setError] = useState('');

  function updateRange(nextStart: string, nextEnd: string) {
    const start = nextStart || undefined;
    const end = nextEnd || undefined;
    const startResult = start ? dateSchema.safeParse(start) : undefined;
    const endResult = end ? dateSchema.safeParse(end) : undefined;
    if ((startResult && !startResult.success) || (endResult && !endResult.success)) {
      setError('Enter valid calendar dates.');
      return;
    }

    const result = dateRangeSchema.safeParse({ startDate: start, endDate: end });
    if (!result.success) {
      setError('End date must be on or after start date.');
      return;
    }

    setError('');
    set({ startDate: start, endDate: end, page: 0 });
  }

  return (
    <fieldset className="flex flex-wrap items-end gap-2">
      <legend className="sr-only">Custom date range</legend>
      <label className="flex flex-col gap-1 text-sm">
        <span>From</span>
        <input
          aria-label="Start date"
          aria-invalid={Boolean(error)}
          type="date"
          max={endDate}
          value={startDate ?? ''}
          onChange={(event) => updateRange(event.target.value, endDate ?? '')}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span>To</span>
        <input
          aria-label="End date"
          aria-invalid={Boolean(error)}
          type="date"
          min={startDate}
          value={endDate ?? ''}
          onChange={(event) => updateRange(startDate ?? '', event.target.value)}
        />
      </label>
      <button
        type="button"
        className="px-3 py-1 border rounded"
        disabled={!startDate && !endDate}
        onClick={() => updateRange('', '')}
      >
        Clear dates
      </button>
      {error && (
        <p className="w-full text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
