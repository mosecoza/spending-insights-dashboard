import { useEffect, useState } from 'react';
import { UI_STRINGS } from '../../../constants/copy';
import { formatDateSA, parseDateSA } from '../../../lib/api';
import { dateRangeSchema, dateSchema } from '../../../lib/validation';
import { useFilters } from '../../../store/useFilters';

export default function DateRangePicker() {
  const { startDate, endDate, set } = useFilters();
  const [error, setError] = useState('');
  const [startDisplay, setStartDisplay] = useState(startDate ? formatDateSA(startDate) : '');
  const [endDisplay, setEndDisplay] = useState(endDate ? formatDateSA(endDate) : '');

  // Resync local display when external state changes (e.g. URL restore)
  useEffect(() => {
    setStartDisplay(startDate ? formatDateSA(startDate) : '');
    setEndDisplay(endDate ? formatDateSA(endDate) : '');
  }, [startDate, endDate]);

  function updateRange(nextStart: string | undefined, nextEnd: string | undefined) {
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

  function handleStartChange(event: React.ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value;
    setStartDisplay(raw);
    if (!raw) {
      setError('');
      updateRange('', parseDateSA(endDisplay ?? '') ?? undefined);
      return;
    }
    const iso = parseDateSA(raw);
    if (!iso) return; // still typing – validate on blur instead
    setError('');
    updateRange(iso, parseDateSA(endDisplay ?? '') ?? undefined);
  }

  function handleStartBlur(event: React.FocusEvent<HTMLInputElement>) {
    const raw = event.currentTarget.value;
    if (!raw) return;
    const iso = parseDateSA(raw);
    if (!iso) {
      setError('Use dd/mm/yyyy format.');
      return;
    }
    setError('');
    // Validate range against the displayed end date
    if (endDisplay) {
      const endIso = parseDateSA(endDisplay);
      if (endIso && endIso < iso) {
        setError('Start date must be on or before end date.');
      }
    }
  }

  function handleEndChange(event: React.ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value;
    setEndDisplay(raw);
    if (!raw) {
      setError('');
      updateRange(parseDateSA(startDisplay ?? '') ?? undefined, '');
      return;
    }
    const iso = parseDateSA(raw);
    if (!iso) return; // still typing – validate on blur instead
    setError('');
    updateRange(parseDateSA(startDisplay ?? '') ?? undefined, iso);
  }

  function handleEndBlur(event: React.FocusEvent<HTMLInputElement>) {
    const raw = event.currentTarget.value;
    if (!raw) return;
    const iso = parseDateSA(raw);
    if (!iso) {
      setError('Use dd/mm/yyyy format.');
      return;
    }
    setError('');
    // Validate range against the displayed start date
    if (startDisplay) {
      const startIso = parseDateSA(startDisplay);
      if (startIso && iso < startIso) {
        setError('End date must be on or after start date.');
      }
    }
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
          type="text"
          value={startDisplay}
          placeholder="dd/mm/yyyy"
          onChange={handleStartChange}
          onBlur={handleStartBlur}
          className="rounded-xl border border-border-default px-3 py-1.5 shadow-sm focus:outline-none focus:ring-2 ring-surface-dark-10"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-secondary">
        <span>{UI_STRINGS.filters.to}</span>
        <input
          aria-label="End date"
          aria-invalid={Boolean(error)}
          type="text"
          value={endDisplay}
          placeholder="dd/mm/yyyy"
          onChange={handleEndChange}
          onBlur={handleEndBlur}
          className="rounded-xl border border-border-default px-3 py-1.5 shadow-sm focus:outline-none focus:ring-2 ring-surface-dark-10"
        />
      </label>
      <button
        type="button"
        className="px-4 py-1.5 border border-border-default rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow disabled:opacity-40 bg-surface-white"
        disabled={!startDate && !endDate}
        onClick={() => updateRange('', '')}
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
