import { useState } from "react";
import BatchForm from "../../components/admin/BatchForm";
import BatchTable from "../../components/admin/BatchTable";
import AssignMentorModal from "../../components/admin/AssignMentorModal";
import EnrollStudentModal from "../../components/admin/EnrollStudentModal";
import AssignMentorToStudentModal from "../../components/admin/AssignMentorToStudentModal";

export default function ManageBatches() {
  const [refreshKey, setRefreshKey] = useState(0);

  const [assignOpen, setAssignOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [assignStudentMentorOpen, setAssignStudentMentorOpen] = useState(false);

  const bumpRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)]">
          Manage Batches
        </h1>

        <div className="flex flex-wrap gap-2">
          {/* Enroll student into batch */}
          <button
            onClick={() => setEnrollOpen(true)}
            className="px-4 py-2 rounded text-sm font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald"
          >
            Enroll Student
          </button>

          {/* Assign mentors to batch */}
          <button
            onClick={() => setAssignOpen(true)}
            className="px-4 py-2 rounded text-sm font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald"
          >
            Assign Mentor to Batch
          </button>

          {/* Assign specific mentor to specific student */}
          <button
            onClick={() => setAssignStudentMentorOpen(true)}
            className="px-4 py-2 rounded text-sm font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald"
          >
            Assign Mentor to Student
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
        <BatchForm onCreated={bumpRefresh} />
        <BatchTable refreshKey={refreshKey} />
      </div>

      {/* Assign mentors to a batch */}
      <AssignMentorModal
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        onAssigned={bumpRefresh}
      />

      {/* Enroll student into a batch */}
      <EnrollStudentModal
        isOpen={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        onEnrolled={bumpRefresh}
      />

      {/* Assign a specific mentor to a specific student */}
      <AssignMentorToStudentModal
        isOpen={assignStudentMentorOpen}
        onClose={() => setAssignStudentMentorOpen(false)}
        onAssigned={bumpRefresh}
      />
    </div>
  );
}
