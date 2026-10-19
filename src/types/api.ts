// Types from CustomerSpendingInsightsEndpoints.md - single source of truth
export type Period = '7d' | '30d' | '90d' | '1y';
export type SortBy = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
export type GoalStatus = 'on_track' | 'warning' | 'over_budget';

export interface DateRange {
  startDate: string;
  endDate: string;
}
export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
export interface FilterCategory {
  name: string;
  color: string;
  icon: string;
}
export interface DateRangePreset {
  label: string;
  value: Period;
}

export interface CustomerProfile {
  customerId: string;
  name: string;
  email: string;
  joinDate: string;
  accountType: string;
  totalSpent: number;
  currency: 'ZAR';
}
export interface ComparedToPrevious {
  spentChange: number;
  transactionChange: number;
}
export interface SpendingSummary {
  period: Period;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  topCategory: string;
  comparedToPrevious: ComparedToPrevious;
}
export interface CategorySlice {
  name: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
  icon: string;
}
export interface CategoriesResponse {
  dateRange: DateRange;
  totalAmount: number;
  categories: CategorySlice[];
}
export interface TrendPoint {
  month: string;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
}
export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  icon: string;
  categoryColor: string;
}
export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: Pagination;
}
export interface Goal {
  id: string;
  category: string;
  monthlyBudget: number;
  currentSpent: number;
  percentageUsed: number;
  daysRemaining: number;
  status: GoalStatus;
}
export interface FiltersResponse {
  categories: FilterCategory[];
  dateRangePresets: DateRangePreset[];
}
