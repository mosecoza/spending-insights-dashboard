import { ErrorBoundary } from 'Components/ErrorBoundary';
import ProfileHeader from 'Features/profile/components/ProfileHeader';
import PeriodPicker from 'Features/summary/components/PeriodPicker';
import SummaryCards from 'Features/summary/components/SummaryCards';
import CategoriesCard from 'Features/categories/components/CategoriesCard';
import DateRangePicker from 'Features/categories/components/DateRangePicker';
import TrendsCard from 'Features/trends/components/TrendsCard';
import TransactionsCard from 'Features/transactions/components/TransactionsCard';
import GoalsCard from 'Features/goals/components/GoalsCard';
import { FilterUrlSync } from 'Components/FilterUrlSync';

export default function App() {
  return (
    <ErrorBoundary>
      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-surface-canvas min-h-screen">
        <FilterUrlSync />
        <ProfileHeader />
        <PeriodPicker />
        <DateRangePicker />
        <SummaryCards />
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <CategoriesCard />
          <TrendsCard />
        </div>
        <TransactionsCard />
        <GoalsCard />
      </main>
    </ErrorBoundary>
  );
}
