import { useProfile } from '../hooks';
import { zar } from '../../../lib/api';

export default function ProfileHeader() {
  const { data, isLoading, isError } = useProfile();
  if (isLoading) return <div className="card"><div className="skeleton h-6 w-48" /></div>;
  if (isError || !data) return <div className="card" role="alert">Failed to load profile</div>;
  return (
    <header className="card flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">{data.name}</h1>
        <p className="text-sm text-slate-500">{data.accountType} • joined {data.joinDate}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-500">Total spent</p>
        <p className="text-xl font-bold">{zar(data.totalSpent)}</p>
      </div>
    </header>
  );
}
