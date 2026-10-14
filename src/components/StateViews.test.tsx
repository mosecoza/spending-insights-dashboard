import { describe, expect, it, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { CardSkeleton, ChartSkeleton, EmptyState, QueryError } from './StateViews';

describe('shared dashboard state views', () => {
  it('announces skeleton loaders as status regions', () => {
    const html = renderToString(
      createElement(CardSkeleton, { label: 'Loading transactions', variant: 'table', rows: 3 }),
    );

    expect(html).toContain('role="status"');
    expect(html).toContain('Loading transactions');
  });

  it('matches category loading content with chart and table placeholders', () => {
    const html = renderToString(
      createElement(CardSkeleton, {
        label: 'Loading category spending',
        variant: 'chart-table',
        rows: 6,
      }),
    );

    expect(html).toContain('Loading category spending');
    expect(html).toContain('h-48');
    expect(html.match(/skeleton h-6 w-full/g)).toHaveLength(6);
  });

  it('reserves space for the summary comparison row', () => {
    const html = renderToString(
      createElement(CardSkeleton, { label: 'Loading spending summary', variant: 'summary' }),
    );

    expect(html).toContain('col-span-2 md:col-span-4');
  });

  it('labels chart chunk-loading skeletons for assistive technology', () => {
    const html = renderToString(
      createElement(ChartSkeleton, { label: 'Loading monthly trends chart' }),
    );

    expect(html).toContain('role="status"');
    expect(html).toContain('Loading monthly trends chart');
    expect(html).toContain('aria-hidden="true"');
  });

  it('retries failed queries through the error action', () => {
    const onRetry = vi.fn();
    const html = renderToString(
      createElement(QueryError, { title: 'Failed to load transactions', onRetry }),
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain('Try again');
    onRetry();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('offers a filter reset from empty transaction results', () => {
    const onAction = vi.fn();
    const html = renderToString(
      createElement(EmptyState, {
        title: 'No transactions match these filters.',
        actionLabel: 'Clear filters',
        onAction,
      }),
    );

    expect(html).toContain('No transactions match these filters.');
    expect(html).toContain('Clear filters');
    onAction();
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
