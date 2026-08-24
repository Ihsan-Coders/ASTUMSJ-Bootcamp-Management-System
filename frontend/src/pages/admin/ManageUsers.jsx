import { useState } from 'react';
import MentorForm from '../../components/admin/MentorForm';
import UserTable from '../../components/admin/UserTable';


export default function ManageMentors() {
  const [refreshKey, setRefreshKey] = useState(0);
  const bumpRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)] mb-6">
        Manage Users
      </h1>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
        <MentorForm onCreated={bumpRefresh} />
        <UserTable refreshKey={refreshKey} />
      </div>
    </div>
  );
}