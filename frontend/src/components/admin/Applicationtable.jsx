import { useEffect, useState } from "react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import { getApplications } from "../../api/application.api";

const STATUS_OPTIONS = [
  "all",
  "Pending Review",
  "Interview",
  "Interview Completed",
  "Passed",
  "Failed",
  "Rejected",
];

export default function ApplicationTable({ refreshKey }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchApplications = () => {
    const params = {};
    if (status !== "all") params.status = status;

    getApplications(params)
      .then((res) => {
        setApplications(res.data.data);
        setError("");
      })
      .catch((err) =>
        setError(err?.response?.data?.message || "Failed to load applications"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, [refreshKey, status]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleApplications = search.trim()
    ? applications.filter((app) => {
        const term = search.trim().toLowerCase();
        return (
          app.name?.toLowerCase().includes(term) ||
          app.email?.toLowerCase().includes(term)
        );
      })
    : applications;

  return (
    <div className="glass-card glow-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Applications
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded border border-border bg-background text-text-primary text-sm"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 rounded border border-border bg-background text-text-primary text-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All statuses" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-danger text-sm mb-3">{error}</p>}

      <Table
        isLoading={loading}
        data={visibleApplications}
        emptyMessage="No applications found"
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "department", label: "Department" },
          { key: "status", label: "Status" },
          {
            key: "assignedMentor",
            label: "Mentor",
            render: (row) => row.assignedMentor?.name || "—",
          },
          {
            key: "createdAt",
            label: "Submitted",
            render: (row) =>
              row.createdAt
                ? new Date(row.createdAt).toLocaleDateString()
                : "—",
          },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <button
                onClick={() => setSelected(row)}
                className="text-gold hover:underline text-sm"
              >
                View
              </button>
            ),
          },
        ]}
      />

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name || "Application"}
      >
        {selected && (
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-text-secondary">Email:</span>{" "}
              {selected.email}
            </p>
            <p>
              <span className="text-text-secondary">Academic year:</span>{" "}
              {selected.academicYear}
            </p>
            <p>
              <span className="text-text-secondary">Department:</span>{" "}
              {selected.department}
            </p>
            <p>
              <span className="text-text-secondary">Gender:</span>{" "}
              {selected.gender}
            </p>
            <p>
              <span className="text-text-secondary">
                Daily commitment:
              </span>{" "}
              {selected.dailyCommitmentHours} hrs/day
            </p>
            <p>
              <span className="text-text-secondary">Status:</span>{" "}
              {selected.status}
            </p>
            <p>
              <span className="text-text-secondary">Assigned mentor:</span>{" "}
              {selected.assignedMentor
                ? `${selected.assignedMentor.name} (${selected.assignedMentor.email})`
                : "Unassigned"}
            </p>
            {selected.interviewScore !== null &&
              selected.interviewScore !== undefined && (
                <p>
                  <span className="text-text-secondary">
                    Interview score:
                  </span>{" "}
                  {selected.interviewScore}
                </p>
              )}
            {selected.mentorRecommendation && (
              <p>
                <span className="text-text-secondary">
                  Mentor recommendation:
                </span>{" "}
                {selected.mentorRecommendation}
              </p>
            )}
            {selected.codeforcesHandle && (
              <p>
                <span className="text-text-secondary">Codeforces:</span>{" "}
                {selected.codeforcesHandle}
              </p>
            )}
            {selected.leetcodeHandle && (
              <p>
                <span className="text-text-secondary">LeetCode:</span>{" "}
                {selected.leetcodeHandle}
              </p>
            )}
            {selected.githubUrl && (
              <p>
                <span className="text-text-secondary">GitHub:</span>{" "}
                <a
                  href={selected.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold hover:underline"
                >
                  {selected.githubUrl}
                </a>
              </p>
            )}
            <div>
              <p className="text-text-secondary mb-1">Motivation:</p>
              <p className="whitespace-pre-wrap">{selected.motivation}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}