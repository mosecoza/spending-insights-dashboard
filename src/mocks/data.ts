import seed from './seed.json';
import { DEMO_DATE_ANCHOR, periodDateRange, resolveDateRange } from '../lib/dateRange';
import type {
  CategoriesResponse,
  CategorySlice,
  Period,
  SortBy,
  SpendingSummary,
  Transaction,
  TrendPoint,
} from '../types/api';

export const DEMO_TRANSACTION_COUNT = 1250;
export const MOCK_TODAY = DEMO_DATE_ANCHOR;

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

export const demoTransactions: Transaction[] = Array.from(
  { length: DEMO_TRANSACTION_COUNT },
  (_, index) => {
    const category = categoryMetadata[index % categoryMetadata.length];
    const date = new Date(`${MOCK_TODAY}T12:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() - index);
    const merchants = merchantNames[category.name] ?? ['Local merchant'];

    return {
      id: `txn_demo_${String(index + 1).padStart(4, '0')}`,
      date: date.toISOString(),
      merchant: merchants[index % merchants.length],
      category: category.name,
      amount: (1750 + ((index * 7919) % 52500)) / 100,
      description: `${category.name} purchase`,
      paymentMethod: paymentMethods[index % paymentMethods.length],
      icon: category.icon,
      categoryColor: category.color,
    };
  },
);

function getPeriodWindow(period: Period) {
  return periodDateRange(period, MOCK_TODAY);
}

export function filterTransactions(filters: {
  period?: Period;
  startDate?: string;
  endDate?: string;
  category?: string;
  sortBy: SortBy;
}): Transaction[] {
  const range = filters.period
    ? resolveDateRange(filters.period, filters.startDate, filters.endDate, MOCK_TODAY)
    : filters.startDate || filters.endDate
      ? {
          startDate: filters.startDate ?? demoTransactions[demoTransactions.length - 1].date.slice(0, 10),
          endDate: filters.endDate ?? MOCK_TODAY,
        }
      : undefined;
  const result = demoTransactions.filter((transaction) => {
    const date = transaction.date.slice(0, 10);
    return (!range || (date >= range.startDate && date <= range.endDate))
      && (!filters.category || transaction.category === filters.category);
  });

  return result.sort((a, b) => {
    if (filters.sortBy === 'amount_desc') return b.amount - a.amount;
    if (filters.sortBy === 'amount_asc') return a.amount - b.amount;
    const dateDifference = Date.parse(a.date) - Date.parse(b.date);
    return filters.sortBy === 'date_desc' ? -dateDifference : dateDifference;
  });
}

export function getSummary(period: Period): SpendingSummary {
  const currentRange = getPeriodWindow(period);
  const current = filterTransactions({ period, sortBy: 'date_desc' });
  const previousEnd = new Date(`${currentRange.startDate}T00:00:00.000Z`);
  previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);
  const previousRange = resolveDateRange(
    period,
    undefined,
    previousEnd.toISOString().slice(0, 10),
    previousEnd.toISOString().slice(0, 10),
  );
  const previous = demoTransactions.filter((transaction) => {
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
      spentChange: previousSpent ? Number((((totalSpent - previousSpent) / previousSpent) * 100).toFixed(1)) : 0,
      transactionChange: previous.length
        ? Number((((current.length - previous.length) / previous.length) * 100).toFixed(1))
        : 0,
    },
  };
}

export function getCategories(period: Period, startDate?: string, endDate?: string): CategoriesResponse {
  const range = resolveDateRange(period, startDate, endDate, MOCK_TODAY);
  const transactions = filterTransactions({ period, startDate, endDate, sortBy: 'date_desc' });
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

export function getTrends(months: number): TrendPoint[] {
  const latestMonth = new Date(`${MOCK_TODAY}T00:00:00.000Z`);
  latestMonth.setUTCDate(1);
  const monthKeys = Array.from({ length: months }, (_, index) => {
    const month = new Date(latestMonth);
    month.setUTCMonth(month.getUTCMonth() - (months - index - 1));
    return month.toISOString().slice(0, 7);
  });

  return monthKeys.map((month) => {
    const transactions = demoTransactions.filter((transaction) => transaction.date.startsWith(month));
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
