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

import { useCategories } from '../hooks';

function TestComponent() {
  useCategories();
  return null;
}

interface QueryOptions {
  queryKey: readonly unknown[];
  queryFn: () => Promise<unknown>;
  enabled?: boolean;
}

describe('useCategories', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    captured.state = undefined;
    captured.options = undefined;
  });

  it('queries categories using the active customer ID', () => {
    captured.state = {
      customerId: '67890',
      period: '30d',
      startDate: undefined,
      endDate: undefined,
    };
    const get = vi.spyOn(api, 'get').mockReturnValue(new Promise(() => undefined));
    renderToString(createElement(TestComponent));

    const options = captured.options as QueryOptions;
    void options.queryFn();

    expect(options.queryKey).toContain('67890');
    expect(options.enabled).toBe(true);
    expect(get).toHaveBeenCalledWith('/customers/67890/spending/categories', {
      params: { period: '30d' },
    });
  });

  it('disables the query when the customer ID is empty', () => {
    captured.state = { customerId: '', period: '30d' };
    renderToString(createElement(TestComponent));

    expect(captured.options).toMatchObject({ enabled: false });
  });
});
