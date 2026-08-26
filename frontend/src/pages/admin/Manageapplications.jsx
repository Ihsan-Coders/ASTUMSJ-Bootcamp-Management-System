import ApplicationTable from "../../components/admin/Applicationtable";

export default function ManageApplications() {
  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)] mb-6">
        Applications
      </h1>

      <ApplicationTable />
    </div>
  );
}