import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from 'Lib/api';

const captured = vi.hoisted(() => ({ options: undefined as unknown, state: undefined as unknown }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: unknown) => {
    captured.options = options;
    return undefined;
  },
}));
vi.mock('../../../store/useFilters', () => ({
  useFilters: (selector: (state: unknown) => unknown) => selector(captured.state),
}));

import { useFilterMeta, useTransactions } from '../hooks';

function TestComponent() {
  useTransactions();
  return null;
}

function FilterMetaComponent() {
  useFilterMeta();
  return null;
}

interface QueryOptions {
  queryKey: readonly unknown[];
  queryFn: () => Promise<unknown>;
  enabled?: boolean;
}

describe('useTransactions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    captured.state = undefined;
    captured.options = undefined;
  });

  it('queries transactions using the active customer ID', () => {
    captured.state = {
      customerId: '67890',
      limit: 20,
      page: 0,
      category: undefined,
      startDate: undefined,
      endDate: undefined,
      sortBy: 'date_desc',
    };
    const get = vi.spyOn(api, 'get').mockReturnValue(new Promise(() => undefined));
    renderToString(createElement(TestComponent));

    const options = captured.options as QueryOptions;
    void options.queryFn();

    expect(options.queryKey).toContain('67890');
    expect(options.enabled).toBe(true);
    expect(get).toHaveBeenCalledWith('/customers/67890/transactions', {
      params: { limit: 20, offset: 0, sortBy: 'date_desc' },
    });
  });

  it('disables filter metadata when the customer ID is empty', () => {
    captured.state = { customerId: '' };
    renderToString(createElement(FilterMetaComponent));

    expect(captured.options).toMatchObject({ enabled: false });
  });
});
