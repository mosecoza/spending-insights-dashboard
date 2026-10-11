// Types from CustomerSpendingInsightsEndpoints.md - single source of truth
export type Period = '7d' | '30d' | '90d' | '1y';
export type SortBy = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
export type GoalStatus = 'on_track' | 'warning' | 'over_budget';

export interface CustomerProfile {
  customerId: string; name: string; email: string;
  joinDate: string; accountType: string; totalSpent: number; currency: 'ZAR';
}
export interface SpendingSummary {
  period: Period; totalSpent: number; transactionCount: number;
  averageTransaction: number; topCategory: string;
  comparedToPrevious: { spentChange: number; transactionChange: number };
}
export interface CategorySlice {
  name: string; amount: number; percentage: number;
  transactionCount: number; color: string; icon: string;
}
export interface CategoriesResponse {
  dateRange: { startDate: string; endDate: string };
  totalAmount: number; categories: CategorySlice[];
}
export interface TrendPoint { month: string; totalSpent: number; transactionCount: number; averageTransaction: number; }
export interface Transaction {
  id: string; date: string; merchant: string; category: string;
  amount: number; description: string; paymentMethod: string;
  icon: string; categoryColor: string;
}
export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: { total: number; limit: number; offset: number; hasMore: boolean };
}
export interface Goal {
  id: string; category: string; monthlyBudget: number; currentSpent: number;
  percentageUsed: number; daysRemaining: number; status: GoalStatus;
}
export interface FiltersResponse {
  categories: { name: string; color: string; icon: string }[];
  dateRangePresets: { label: string; value: Period }[];
}
