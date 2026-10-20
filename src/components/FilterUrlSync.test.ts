import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_CUSTOMER_ID } from '../lib/api';
import { DEFAULT_DATE_RANGE } from '../lib/dateRange';
import { useFilters } from '../store/useFilters';
import { syncFiltersFromSearch } from './FilterUrlSync';

describe('filter URL synchronization', () => {
  afterEach(() => {
    useFilters.getState().setCustomerId(DEFAULT_CUSTOMER_ID);
    useFilters.getState().set({
      period: '30d',
      ...DEFAULT_DATE_RANGE,
      category: undefined,
      sortBy: 'date_desc',
      page: 0,
      limit: 20,
      months: 12,
    });
  });

  it('preserves customer ID when URL navigation changes filters', () => {
    useFilters.getState().setCustomerId('67890');
    useFilters.getState().set({
      category: 'Groceries',
      startDate: '2024-08-01',
      endDate: '2024-08-31',
    });

    syncFiltersFromSearch('?period=90d');

    expect(useFilters.getState()).toMatchObject({
      customerId: '67890',
      period: '90d',
      category: undefined,
      ...DEFAULT_DATE_RANGE,
    });
  });
});
