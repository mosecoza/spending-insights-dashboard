import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

type SummaryState = {
  period: string;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  topCategory: string;
  comparedToPrevious?: { spentChange: number; transactionChange: number };
};

const state = vi.hoisted(() => ({
  summary: {
    period: '30d',
    totalSpent: 1234.56,
    transactionCount: 10,
    averageTransaction: 123.46,
    topCategory: 'Groceries',
    comparedToPrevious: { spentChange: 5.2, transactionChange: -1.1 },
  } as SummaryState,
}));

vi.mock('../hooks', () => ({
  useSummary: () => ({
    data: state.summary,
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch: vi.fn(),
  }),
}));

import SummaryCards from './SummaryCards';

describe('SummaryCards comparison fallback', () => {
  it('renders comparison values when present', () => {
    state.summary = {
      period: '30d',
      totalSpent: 1234.56,
      transactionCount: 10,
      averageTransaction: 123.46,
      topCategory: 'Groceries',
      comparedToPrevious: { spentChange: 5.2, transactionChange: -1.1 },
    };

    const html = renderToString(createElement(SummaryCards));
    const text = html.replace(/<!-- -->/g, '');

    expect(text).toContain('5.2% spent');
    expect(text).toContain('-1.1% transactions');
    expect(text).toContain('Total spent');
  });

  it('renders without crashing when comparedToPrevious is missing', () => {
    state.summary = {
      period: '30d',
      totalSpent: 1234.56,
      transactionCount: 10,
      averageTransaction: 123.46,
      topCategory: 'Groceries',
    };

    let html = '';
    expect(() => {
      html = renderToString(createElement(SummaryCards));
    }).not.toThrow();

    expect(html).toContain('Total spent');
    expect(html).toContain('Comparison unavailable');
  });
});
