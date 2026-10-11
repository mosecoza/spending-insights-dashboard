import { ErrorBoundary } from './components/ErrorBoundary';
import ProfileHeader from './features/dashboard/components/ProfileHeader';
import PeriodPicker from './features/dashboard/components/PeriodPicker';
import SummaryCards from './features/dashboard/components/SummaryCards';
import CategoriesCard from './features/dashboard/components/CategoriesCard';
import TrendsCard from './features/dashboard/components/TrendsCard';
import TransactionsCard from './features/dashboard/components/TransactionsCard';
import GoalsCard from './features/dashboard/components/GoalsCard';
import DateRangePicker from './features/dashboard/components/DateRangePicker';
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
