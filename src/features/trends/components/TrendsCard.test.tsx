import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

const captured = vi.hoisted(() => ({ filters: { months: 12, set: vi.fn() } }));

vi.mock('../hooks', () => ({
  useTrends: () => ({
    data: { trends: [] },
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch: vi.fn(),
  }),
}));
vi.mock('../../../store/useFilters', () => ({
  useFilters: (selector?: (state: typeof captured.filters) => unknown) =>
    selector ? selector(captured.filters) : captured.filters,
}));

import TrendsCard from './TrendsCard';

describe('TrendsCard empty state', () => {
  afterEach(() => {
    captured.filters.months = 12;
  });

  it('keeps the month selector available when there is no trend data', () => {
    const html = renderToString(createElement(TrendsCard));

    expect(html).toContain('No trend data available.');
    expect(html).toContain('Choose more months to see spending trends.');
    expect(html).toContain('aria-label="Trend months"');
  });
});
