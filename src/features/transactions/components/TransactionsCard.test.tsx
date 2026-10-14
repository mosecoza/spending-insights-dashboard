import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

const captured = vi.hoisted(() => ({
  filters: {
    page: 0,
    limit: 20,
    category: undefined as string | undefined,
    sortBy: 'date_desc' as const,
    set: vi.fn(),
  },
  refetchMeta: vi.fn(),
}));

vi.mock('../hooks', () => ({
  useTransactions: () => ({
    data: { transactions: [], pagination: { total: 0, limit: 20, offset: 0, hasMore: false } },
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch: vi.fn(),
  }),
  useFilterMeta: () => ({
    data: undefined,
    isError: true,
    isFetching: false,
    refetch: captured.refetchMeta,
  }),
}));
vi.mock('../../../store/useFilters', () => ({
  useFilters: (selector?: (state: typeof captured.filters) => unknown) =>
    selector ? selector(captured.filters) : captured.filters,
}));

import TransactionsCard from './TransactionsCard';

describe('TransactionsCard empty and filter metadata states', () => {
  afterEach(() => {
    captured.filters.category = undefined;
    captured.filters.page = 0;
    captured.refetchMeta.mockClear();
  });

  it('shows an actionable no-results message and filter-option retry', () => {
    const html = renderToString(createElement(TransactionsCard));

    expect(html).toContain('No transactions match these filters.');
    expect(html).toContain('Clear filters');
    expect(html).toContain('Could not load category filter options.');
    expect(html).toContain('Retry category options');
  });
});
