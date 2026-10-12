import { describe, expect, it } from 'vitest';
import { parseFilterSearch, serializeFilterSearch } from './filterUrl';

describe('dashboard filter URL state', () => {
  it('parses and serializes shareable filters', () => {
    const filters = parseFilterSearch(
      '?period=90d&startDate=2024-06-01&endDate=2024-06-30&category=Groceries&sortBy=amount_desc&page=2&limit=50&months=24',
    );

    expect(filters).toEqual({
      period: '90d',
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      category: 'Groceries',
      sortBy: 'amount_desc',
      page: 2,
      limit: 50,
      months: 24,
    });
    expect(serializeFilterSearch(filters)).toBe(
      'period=90d&startDate=2024-06-01&endDate=2024-06-30&category=Groceries&sortBy=amount_desc&page=2&limit=50&months=24',
    );
  });

  it('normalizes invalid values to safe defaults', () => {
    expect(parseFilterSearch('?period=forever&page=-2')).toEqual({
      period: '30d',
      sortBy: 'date_desc',
      page: 0,
      limit: 20,
      months: 12,
    });
    expect(parseFilterSearch('?startDate=2024-12-02&endDate=2024-12-01')).toEqual({
      period: '30d',
      sortBy: 'date_desc',
      page: 0,
      limit: 20,
      months: 12,
    });
  });

  it('omits default values from the URL', () => {
    expect(
      serializeFilterSearch({
        period: '30d',
        sortBy: 'date_desc',
        page: 0,
        limit: 20,
        months: 12,
      }),
    ).toBe('');
  });
});
