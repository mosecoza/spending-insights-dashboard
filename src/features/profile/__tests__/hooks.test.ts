import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

const captured = vi.hoisted(() => ({ options: undefined as unknown }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: unknown) => {
    captured.options = options;
    return undefined;
  },
}));
vi.mock('../../../store/useFilters', () => ({
  useFilters: (selector: (state: unknown) => unknown) => selector({ customerId: '' }),
}));

import { useProfile } from '../hooks';

function TestComponent() {
  useProfile();
  return null;
}

describe('useProfile', () => {
  afterEach(() => {
    captured.options = undefined;
  });

  it('disables the query when the customer ID is empty', () => {
    renderToString(createElement(TestComponent));
    expect(captured.options).toMatchObject({ enabled: false });
  });
});
