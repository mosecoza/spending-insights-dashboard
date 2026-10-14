import { describe, expect, it } from 'vitest';
import {
  demoTransactions,
  filterTransactions,
  getCategories,
  getCustomerProfile,
  getGoals,
  getSummary,
  getTrends,
} from './data';

describe('demo API data', () => {
  it('provides distinct profile and transaction fixtures for supported customers', () => {
    expect(getCustomerProfile('12345').name).toBe('John Doe');
    expect(getCustomerProfile('67890').name).toBe('Ayesha Khan');

    const firstCustomer = filterTransactions({ period: '30d', sortBy: 'date_desc' }, '12345')[0];
    const secondCustomer = filterTransactions({ period: '30d', sortBy: 'date_desc' }, '67890')[0];
    expect(secondCustomer.id).not.toBe(firstCustomer.id);
    expect(secondCustomer.amount).not.toBe(firstCustomer.amount);
  });

  it('rejects unsupported customer IDs in customer data helpers', () => {
    expect(() => getCustomerProfile('99999')).toThrow('Unsupported demo customer ID');
    expect(() => filterTransactions({ sortBy: 'date_desc' }, '99999')).toThrow(
      'Unsupported demo customer ID',
    );
  });

  it('returns a profile with the requested customer ID', () => {
    expect(getCustomerProfile('67890').customerId).toBe('67890');
  });

  it('provides the declared full transaction count and consistent pages', () => {
    const allTransactions = filterTransactions({ sortBy: 'date_desc' });
    const firstPage = allTransactions.slice(0, 20);
    const secondPage = allTransactions.slice(20, 40);

    expect(demoTransactions).toHaveLength(1250);
    expect(allTransactions).toHaveLength(1250);
    expect(firstPage).toHaveLength(20);
    expect(secondPage).toHaveLength(20);
    expect(new Set([...firstPage, ...secondPage].map(({ id }) => id)).size).toBe(40);
  });

  it('applies period, custom date, and category filters', () => {
    expect(filterTransactions({ period: '7d', sortBy: 'date_desc' })).toHaveLength(7);
    const customRange = filterTransactions({
      period: '1y',
      startDate: '2024-09-10',
      endDate: '2024-09-12',
      category: 'Groceries',
      sortBy: 'date_desc',
    });

    expect(customRange).toHaveLength(1);
    expect(customRange[0].date.slice(0, 10)).toBe('2024-09-10');
    expect(customRange[0].category).toBe('Groceries');
  });

  it('returns aggregates based on filtered transactions', () => {
    const categories = getCategories('7d');
    const summary = getSummary('7d');

    expect(categories.totalAmount).toBeGreaterThan(0);
    expect(
      categories.categories.reduce((sum, category) => sum + category.transactionCount, 0),
    ).toBe(7);
    expect(summary.transactionCount).toBe(7);
    expect(summary.totalSpent).toBe(categories.totalAmount);
  });

  it('returns the requested number of monthly trend points', () => {
    const trends = getTrends(6);
    expect(trends).toHaveLength(6);
    expect(trends[5].month).toBe('2024-09');
    expect(trends[5].transactionCount).toBeGreaterThan(0);
  });

  it('derives monthly goals from transactions and reports over-budget status', () => {
    const { goals } = getGoals();
    const septemberSpending = demoTransactions
      .filter((transaction) => transaction.date.startsWith('2024-09'))
      .filter((transaction) => transaction.category === 'Groceries')
      .reduce((total, transaction) => total + transaction.amount, 0);
    const groceriesGoal = goals.find((goal) => goal.category === 'Groceries');

    expect(goals).toHaveLength(6);
    expect(groceriesGoal?.currentSpent).toBe(Number(septemberSpending.toFixed(2)));
    expect(goals.some((goal) => goal.status === 'over_budget')).toBe(true);
  });
});
