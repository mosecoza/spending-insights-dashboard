import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_CUSTOMER_ID } from 'Lib/api';
import { DEFAULT_DATE_RANGE } from 'Lib/dateRange';
import { useFilters } from './useFilters';

describe('active customer state', () => {
  afterEach(() => {
    useFilters.getState().set({
      period: '30d',
      ...DEFAULT_DATE_RANGE,
      category: undefined,
      sortBy: 'date_desc',
      page: 0,
      limit: 20,
      months: 12,
    });
    useFilters.getState().setCustomerId(DEFAULT_CUSTOMER_ID);
  });

  it('defaults to the demo customer', () => {
    expect(useFilters.getState().customerId).toBe(DEFAULT_CUSTOMER_ID);
  });

  it('resets all dashboard filters when the customer changes', () => {
    useFilters.getState().set({
      period: '90d',
      startDate: '2024-08-01',
      endDate: '2024-08-31',
      category: 'Groceries',
      sortBy: 'amount_desc',
      page: 3,
      limit: 50,
      months: 24,
    });

    useFilters.getState().setCustomerId(' 67890 ');

    expect(useFilters.getState()).toMatchObject({
      customerId: '67890',
      period: '30d',
      ...DEFAULT_DATE_RANGE,
      category: undefined,
      sortBy: 'date_desc',
      page: 0,
      limit: 20,
      months: 12,
    });
  });

  it('clears category and custom date filters when the customer changes', () => {
    useFilters.getState().set({
      category: 'Groceries',
      startDate: '2024-08-01',
      endDate: '2024-08-31',
    });

    useFilters.getState().setCustomerId('67890');

    expect(useFilters.getState()).toMatchObject({
      customerId: '67890',
      category: undefined,
      ...DEFAULT_DATE_RANGE,
    });
  });

  it('does not reset filters when setting the same customer', () => {
    useFilters.getState().set({ period: '90d', page: 2 });
    useFilters.getState().setCustomerId(DEFAULT_CUSTOMER_ID);
    expect(useFilters.getState()).toMatchObject({
      customerId: DEFAULT_CUSTOMER_ID,
      period: '90d',
      page: 2,
    });
  });

  it('starts with the default date range', () => {
    expect(useFilters.getState()).toMatchObject(DEFAULT_DATE_RANGE);
  });

  it('rejects an empty customer ID', () => {
    expect(() => useFilters.getState().setCustomerId('  ')).toThrow();
  });
});
