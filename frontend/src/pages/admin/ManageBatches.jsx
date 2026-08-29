import { useState } from "react";
import BatchForm from "../../components/admin/BatchForm";
import BatchTable from "../../components/admin/BatchTable";
import AssignMentorModal from "../../components/admin/AssignMentorModal";
import AssignMentorToStudentModal from "../../components/admin/AssignMentorToStudentModal";

export default function ManageBatches() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Assign mentor to batch modal
  const [assignOpen, setAssignOpen] = useState(false);

  // Assign mentor to specific student modal
  const [assignStudentMentorOpen, setAssignStudentMentorOpen] = useState(false);

  const bumpRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)]">
          Manage Batches
        </h1>

        <div className="flex flex-wrap gap-2">
          {/* Assign mentor to batch */}
          <button
            type="button"
            onClick={() => setAssignOpen(true)}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-obsidian
                       bg-gradient-to-r from-gold to-emerald
                       hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]
                       transition-all duration-200"
          >
            Assign Mentor to Batch
          </button>

          {/* Assign mentor to student */}
          <button
            type="button"
            onClick={() => setAssignStudentMentorOpen(true)}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-obsidian
                       bg-gradient-to-r from-gold to-emerald
                       hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]
                       transition-all duration-200"
          >
            Assign Mentor to Student
          </button>
        </div>
      </div>

      {/* Batches */}
      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
        <BatchForm onCreated={bumpRefresh} />

        <BatchTable refreshKey={refreshKey} />
      </div>

      {/* Assign mentor to batch */}
      <AssignMentorModal
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        onAssigned={bumpRefresh}
      />

      {/* Assign mentor to specific student */}
      <AssignMentorToStudentModal
        isOpen={assignStudentMentorOpen}
        onClose={() => setAssignStudentMentorOpen(false)}
        onAssigned={bumpRefresh}
      />
    </div>
  );
}
