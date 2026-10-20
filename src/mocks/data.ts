import seed from './seed.json';
import {
  DEMO_DATE_ANCHOR,
  DEMO_TRANSACTION_COUNT,
  periodDateRange,
  resolveDateRange,
} from '../lib/dateRange';
import { DEFAULT_CUSTOMER_ID } from '../lib/api';
import { demoCustomers, findDemoCustomer } from '../lib/demoCustomers';
import type {
  CategoriesResponse,
  CategorySlice,
  CustomerProfile,
  Goal,
  Period,
  SortBy,
  SpendingSummary,
  Transaction,
  TrendPoint,
} from '../types/api';

export { DEMO_TRANSACTION_COUNT };
export const MOCK_TODAY = DEMO_DATE_ANCHOR;

export function getCustomerProfile(customerId: string): CustomerProfile {
  const customer = findDemoCustomer(customerId);
  if (!customer) throw new Error(`Unsupported demo customer ID: ${customerId}`);
  const { customerId: id, name, email, joinDate, accountType, totalSpent, currency } = customer;
  return { customerId: id, name, email, joinDate, accountType, totalSpent, currency };
}

const categoryMetadata = seed.filters.categories;
const merchantNames: Record<string, string[]> = {
  Groceries: ['Pick n Pay', 'Checkers', 'Woolworths Food', 'Spar'],
  Entertainment: ['Netflix', 'Nu Metro', 'Spotify', 'Showmax'],
  Transportation: ['Shell', 'Engen', 'Uber', 'City of Cape Town'],
  Dining: ['Nandos', 'Wimpy', 'Vida e Caffe', 'KFC'],
  Shopping: ['Takealot', 'Mr Price', 'Dis-Chem', 'Game'],
  Utilities: ['Eskom', 'City Power', 'Vodacom', 'MTN'],
};
const paymentMethods = ['Debit Card', 'Credit Card', 'Debit Order'];

function createTransactions(variant: number, customerId: string): Transaction[] {
  return Array.from({ length: DEMO_TRANSACTION_COUNT }, (_, index) => {
    const category = categoryMetadata[(index + variant) % categoryMetadata.length];
    const date = new Date(`${MOCK_TODAY}T12:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() - index);
    const merchants = merchantNames[category.name] ?? ['Local merchant'];

    return {
      id: `txn_${customerId}_${String(index + 1).padStart(4, '0')}`,
      date: date.toISOString(),
      merchant: merchants[(index + variant) % merchants.length],
      category: category.name,
      amount: (1750 + ((index * 7919 + variant * 104729) % 52500)) / 100,
      description: `${category.name} purchase`,
      paymentMethod: paymentMethods[index % paymentMethods.length],
      icon: category.icon,
      categoryColor: category.color,
    };
  });
}

const transactionsByCustomer = new Map(
  demoCustomers.map((customer) => [
    customer.customerId,
    createTransactions(customer.transactionVariant, customer.customerId),
  ]),
);

function getCustomerTransactions(customerId: string) {
  const transactions = transactionsByCustomer.get(customerId);
  if (!transactions) throw new Error(`Unsupported demo customer ID: ${customerId}`);
  return transactions;
}

export const demoTransactions = getCustomerTransactions(DEFAULT_CUSTOMER_ID);

function getPeriodWindow(period: Period) {
  return periodDateRange(period, MOCK_TODAY);
}

export function filterTransactions(
  filters: {
    period?: Period;
    startDate?: string;
    endDate?: string;
    category?: string;
    sortBy: SortBy;
  },
  customerId = DEFAULT_CUSTOMER_ID,
): Transaction[] {
  const customerTransactions = getCustomerTransactions(customerId);
  const range = filters.period
    ? resolveDateRange(filters.period, filters.startDate, filters.endDate, MOCK_TODAY)
    : filters.startDate || filters.endDate
      ? {
          startDate:
            filters.startDate ??
            customerTransactions[customerTransactions.length - 1].date.slice(0, 10),
          endDate: filters.endDate ?? MOCK_TODAY,
        }
      : undefined;
  const result = customerTransactions.filter((transaction) => {
    const date = transaction.date.slice(0, 10);
    return (
      (!range || (date >= range.startDate && date <= range.endDate)) &&
      (!filters.category || transaction.category === filters.category)
    );
  });

  return result.sort((a, b) => {
    if (filters.sortBy === 'amount_desc') return b.amount - a.amount;
    if (filters.sortBy === 'amount_asc') return a.amount - b.amount;
    const dateDifference = Date.parse(a.date) - Date.parse(b.date);
    return filters.sortBy === 'date_desc' ? -dateDifference : dateDifference;
  });
}

export function getSummary(period: Period, customerId = DEFAULT_CUSTOMER_ID): SpendingSummary {
  const currentRange = getPeriodWindow(period);
  const current = filterTransactions({ period, sortBy: 'date_desc' }, customerId);
  const previousEnd = new Date(`${currentRange.startDate}T00:00:00.000Z`);
  previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);
  const previousRange = resolveDateRange(
    period,
    undefined,
    previousEnd.toISOString().slice(0, 10),
    previousEnd.toISOString().slice(0, 10),
  );
  const previous = getCustomerTransactions(customerId).filter((transaction) => {
    const date = transaction.date.slice(0, 10);
    return date >= previousRange.startDate && date <= previousRange.endDate;
  });
  const totalSpent = current.reduce((total, transaction) => total + transaction.amount, 0);
  const previousSpent = previous.reduce((total, transaction) => total + transaction.amount, 0);
  const categoryTotals = new Map<string, number>();
  for (const transaction of current) {
    categoryTotals.set(
      transaction.category,
      (categoryTotals.get(transaction.category) ?? 0) + transaction.amount,
    );
  }
  const topCategory = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';

  return {
    period,
    totalSpent: Number(totalSpent.toFixed(2)),
    transactionCount: current.length,
    averageTransaction: current.length ? Number((totalSpent / current.length).toFixed(2)) : 0,
    topCategory,
    comparedToPrevious: {
      spentChange: previousSpent
        ? Number((((totalSpent - previousSpent) / previousSpent) * 100).toFixed(1))
        : 0,
      transactionChange: previous.length
        ? Number((((current.length - previous.length) / previous.length) * 100).toFixed(1))
        : 0,
    },
  };
}

export function getCategories(
  period: Period,
  startDate?: string,
  endDate?: string,
  customerId = DEFAULT_CUSTOMER_ID,
): CategoriesResponse {
  const range = resolveDateRange(period, startDate, endDate, MOCK_TODAY);
  const transactions = filterTransactions(
    { period, startDate, endDate, sortBy: 'date_desc' },
    customerId,
  );
  const amounts = new Map<string, { amount: number; transactionCount: number }>();
  for (const transaction of transactions) {
    const item = amounts.get(transaction.category) ?? { amount: 0, transactionCount: 0 };
    item.amount += transaction.amount;
    item.transactionCount += 1;
    amounts.set(transaction.category, item);
  }
  const totalAmount = transactions.reduce((total, transaction) => total + transaction.amount, 0);
  const categories: CategorySlice[] = categoryMetadata.map((metadata) => {
    const item = amounts.get(metadata.name) ?? { amount: 0, transactionCount: 0 };
    return {
      ...metadata,
      amount: Number(item.amount.toFixed(2)),
      percentage: totalAmount ? Number(((item.amount / totalAmount) * 100).toFixed(1)) : 0,
      transactionCount: item.transactionCount,
    };
  });

  return {
    dateRange: range,
    totalAmount: Number(totalAmount.toFixed(2)),
    categories,
  };
}

export function getTrends(months: number, customerId = DEFAULT_CUSTOMER_ID): TrendPoint[] {
  const customerTransactions = getCustomerTransactions(customerId);
  const latestMonth = new Date(`${MOCK_TODAY}T00:00:00.000Z`);
  latestMonth.setUTCDate(1);
  const monthKeys = Array.from({ length: months }, (_, index) => {
    const month = new Date(latestMonth);
    month.setUTCMonth(month.getUTCMonth() - (months - index - 1));
    return month.toISOString().slice(0, 7);
  });

  return monthKeys.map((month) => {
    const transactions = customerTransactions.filter((transaction) =>
      transaction.date.startsWith(month),
    );
    const totalSpent = transactions.reduce((total, transaction) => total + transaction.amount, 0);
    return {
      month,
      totalSpent: Number(totalSpent.toFixed(2)),
      transactionCount: transactions.length,
      averageTransaction: transactions.length
        ? Number((totalSpent / transactions.length).toFixed(2))
        : 0,
    };
  });
}

export function getGoals(customerId = DEFAULT_CUSTOMER_ID): { goals: Goal[] } {
  const customerTransactions = getCustomerTransactions(customerId);
  const month = MOCK_TODAY.slice(0, 7);
  const monthTransactions = customerTransactions.filter((transaction) =>
    transaction.date.startsWith(month),
  );
  const budgets: Record<string, number> = {
    Groceries: 1000,
    Entertainment: 400,
    Transportation: 450,
    Dining: 350,
    Shopping: 400,
    Utilities: 500,
  };
  const year = Number(MOCK_TODAY.slice(0, 4));
  const monthNumber = Number(MOCK_TODAY.slice(5, 7));
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const daysRemaining = daysInMonth - Number(MOCK_TODAY.slice(8, 10));

  return {
    goals: categoryMetadata.map((category) => {
      const currentSpent = Number(
        monthTransactions
          .filter((transaction) => transaction.category === category.name)
          .reduce((total, transaction) => total + transaction.amount, 0)
          .toFixed(2),
      );
      const monthlyBudget = budgets[category.name] ?? 500;
      const percentageUsed = Number(((currentSpent / monthlyBudget) * 100).toFixed(2));

      return {
        id: `goal_${category.name.toLowerCase()}`,
        category: category.name,
        monthlyBudget,
        currentSpent,
        percentageUsed,
        daysRemaining,
        status:
          percentageUsed >= 100 ? 'over_budget' : percentageUsed >= 80 ? 'warning' : 'on_track',
      };
    }),
  };
}
