import { ErrorBoundary } from './components/ErrorBoundary';
import ProfileHeader from './features/profile/components/ProfileHeader';
import PeriodPicker from './features/summary/components/PeriodPicker';
import SummaryCards from './features/summary/components/SummaryCards';
import CategoriesCard from './features/categories/components/CategoriesCard';
import DateRangePicker from './features/categories/components/DateRangePicker';
import TrendsCard from './features/trends/components/TrendsCard';
import TransactionsCard from './features/transactions/components/TransactionsCard';
import GoalsCard from './features/goals/components/GoalsCard';
import { FilterUrlSync } from './components/FilterUrlSync';

export default function App() {
  return (
    <ErrorBoundary>
      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <FilterUrlSync />
        <ProfileHeader />
        <PeriodPicker />
        <DateRangePicker />
        <SummaryCards />
        <div className="grid md:grid-cols-2 gap-4">
          <CategoriesCard />
          <TrendsCard />
        </div>
        <TransactionsCard />
        <GoalsCard />
      </main>
    </ErrorBoundary>
  );
}
