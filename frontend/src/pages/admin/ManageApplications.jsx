import { useState } from "react";
import ApplicationTable from "../../components/admin/ApplicationTable";
import ManageInterviewQuestionsModal from "../../components/admin/ManageInterviewQuestionsModal";

export default function ManageApplications() {
  const [questionsOpen, setQuestionsOpen] = useState(false);

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)]">
          Applications
        </h1>

        <button
          onClick={() => setQuestionsOpen(true)}
          className="text-sm px-4 py-2 rounded-lg border border-gold/30 bg-gold/10 text-gold hover:bg-gold/20"
        >
          Manage Interview Questions
        </button>
      </div>

      <ApplicationTable />

      <ManageInterviewQuestionsModal
        isOpen={questionsOpen}
        onClose={() => setQuestionsOpen(false)}
      />
    </div>
  );
}
