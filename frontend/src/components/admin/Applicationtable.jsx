import { useEffect, useState } from "react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import AssignApplicationMentorModal from "./AssignApplicationMentorModal";
import {
  getApplications,
  approveApplication,
  rejectApplication,
  finalDecision,
} from "../../api/application.api";

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
  const [assigning, setAssigning] = useState(null);
  const [actionError, setActionError] = useState("");
  const [actioningId, setActioningId] = useState(null);
  const [credentials, setCredentials] = useState(null);

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

  const handleApprove = async (application) => {
    setActionError("");
    setActioningId(application._id);
    try {
      await approveApplication(application._id);
      fetchApplications();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to approve application");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (application) => {
    if (!window.confirm(`Reject ${application.name}'s application?`)) return;
    setActionError("");
    setActioningId(application._id);
    try {
      await rejectApplication(application._id);
      fetchApplications();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to reject application");
    } finally {
      setActioningId(null);
    }
  };

  const handleFinalDecision = async (application, decision) => {
    const verb = decision === "pass" ? "accept" : "decline";
    if (!window.confirm(`${verb === "accept" ? "Accept" : "Decline"} ${application.name}?`))
      return;
    setActionError("");
    setActioningId(application._id);
    try {
      const res = await finalDecision(application._id, decision);
      if (decision === "pass" && res.data.data?.tempPassword) {
        setCredentials(res.data.data);
      }
      fetchApplications();
    } catch (err) {
      setActionError(err?.response?.data?.message || `Failed to ${verb} applicant`);
    } finally {
      setActioningId(null);
    }
  };

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

      {(error || actionError) && (
        <p className="text-danger text-sm mb-3">{error || actionError}</p>
      )}

      <Table
        isLoading={loading}
        data={visibleApplications}
        emptyMessage="No applications found"
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "department", label: "Department" },
          {
            key: "status",
            label: "Status",
            render: (row) => (
              <span>
                {row.status}
                {row.status === "Interview Completed" &&
                  row.interviewAnswers?.length > 0 && (
                    <span className="text-gold text-xs ml-1">
                      (score:{" "}
                      {row.interviewAnswers.reduce((s, a) => s + a.score, 0)}/
                      {row.interviewAnswers.reduce((s, a) => s + a.maxScore, 0)})
                    </span>
                  )}
              </span>
            ),
          },
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
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelected(row)}
                  className="text-gold hover:underline text-sm"
                >
                  View
                </button>

                {row.status === "Pending Review" && (
                  <>
                    <button
                      onClick={() => handleApprove(row)}
                      disabled={actioningId === row._id}
                      className="text-emerald hover:underline text-sm disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(row)}
                      disabled={actioningId === row._id}
                      className="text-danger hover:underline text-sm disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}

                {row.status === "Interview" && (
                  <button
                    onClick={() => setAssigning(row)}
                    className="text-gold hover:underline text-sm"
                  >
                    {row.assignedMentor ? "Reassign Mentor" : "Assign Mentor"}
                  </button>
                )}

                {row.status === "Interview Completed" && (
                  <>
                    <button
                      onClick={() => handleFinalDecision(row, "pass")}
                      disabled={actioningId === row._id}
                      className="text-emerald hover:underline text-sm disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleFinalDecision(row, "fail")}
                      disabled={actioningId === row._id}
                      className="text-danger hover:underline text-sm disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
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
              <span className="text-text-secondary">Phone:</span>{" "}
              {selected.phoneNumber}
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
            {selected.interviewAnswers?.length > 0 && (
              <div>
                <p className="text-text-secondary mb-1">Interview results:</p>
                <div className="space-y-1">
                  {selected.interviewAnswers.map((a, i) => (
                    <p key={i}>
                      {a.questionText}: {a.score}/{a.maxScore}
                    </p>
                  ))}
                  <p className="font-medium">
                    Total:{" "}
                    {selected.interviewAnswers.reduce((s, a) => s + a.score, 0)}
                    /
                    {selected.interviewAnswers.reduce(
                      (s, a) => s + a.maxScore,
                      0,
                    )}
                  </p>
                </div>
              </div>
            )}
            {selected.interviewNote && (
              <div>
                <p className="text-text-secondary mb-1">Mentor's note:</p>
                <p className="whitespace-pre-wrap">{selected.interviewNote}</p>
              </div>
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

      <AssignApplicationMentorModal
        application={assigning}
        onClose={() => setAssigning(null)}
        onAssigned={fetchApplications}
      />

      <Modal
        isOpen={!!credentials}
        onClose={() => setCredentials(null)}
        title="Student Account Created"
      >
        {credentials && (
          <div className="space-y-2 text-sm">
            <p className="text-danger">
              Email sending isn't configured yet — share these credentials
              with the student manually.
            </p>
            <p>
              <span className="text-text-secondary">Name:</span>{" "}
              {credentials.student.name}
            </p>
            <p>
              <span className="text-text-secondary">Email:</span>{" "}
              {credentials.student.email}
            </p>
            <p>
              <span className="text-text-secondary">Batch:</span>{" "}
              {credentials.student.batch}
            </p>
            <p>
              <span className="text-text-secondary">Temporary password:</span>{" "}
              <span className="font-mono text-gold">
                {credentials.tempPassword}
              </span>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
