import { useState } from 'react';
import BatchForm from '../../components/admin/BatchForm';
import BatchTable from '../../components/admin/BatchTable';
import AssignMentorModal from '../../components/admin/AssignMentorModal';

export default function ManageBatches() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [assignOpen, setAssignOpen] = useState(false);
  const bumpRefresh = () => setRefreshKey((k) => k + 1);
  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)]">
          Manage Batches
        </h1>
        <button
          onClick={() => setAssignOpen(true)}
          className="px-4 py-2 rounded text-sm font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald"
        >
          Assign Mentor
        </button>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
        <BatchForm onCreated={bumpRefresh} />
        <BatchTable refreshKey={refreshKey} />
      </div>

      <AssignMentorModal
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        onAssigned={bumpRefresh}
      />
    </div>
  );
}
