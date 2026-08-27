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

  // Action state
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [actioningId, setActioningId] = useState(null);

  // Confirmation state
  const [confirmation, setConfirmation] = useState(null);

  const fetchApplications = () => {
    const params = {};
    if (status !== "all") params.status = status;

    setLoading(true);

    getApplications(params)
      .then((res) => {
        setApplications(res.data.data);
        setError("");
      })
      .catch((err) =>
        setError(
          err?.response?.data?.message || "Failed to load applications"
        )
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchApplications();
  }, [refreshKey, status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show a success message and automatically remove it
  const showSuccess = (message) => {
    setActionSuccess(message);
    setActionError("");

    setTimeout(() => {
      setActionSuccess("");
    }, 4000);
  };

  const handleApprove = async (application) => {
    setActionError("");
    setActionSuccess("");
    setActioningId(application._id);

    try {
      await approveApplication(application._id);
      await fetchApplications();

      showSuccess(`${application.name}'s application has been approved.`);
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to approve application"
      );
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = (application) => {
    setConfirmation({
      type: "reject",
      application,
      title: "Reject Application",
      message: `Are you sure you want to reject ${application.name}'s application?`,
      confirmText: "Reject Application",
    });
  };

  const handleFinalDecision = (application, decision) => {
    const isPass = decision === "pass";

    setConfirmation({
      type: decision,
      application,
      title: isPass ? "Accept Application" : "Decline Application",
      message: isPass
        ? `Are you sure you want to accept ${application.name}?`
        : `Are you sure you want to decline ${application.name}?`,
      confirmText: isPass ? "Accept Application" : "Decline Application",
    });
  };

  const executeConfirmation = async () => {
    if (!confirmation) return;

    const { type, application } = confirmation;

    setConfirmation(null);
    setActionError("");
    setActionSuccess("");
    setActioningId(application._id);

    try {
      if (type === "reject") {
        await rejectApplication(application._id);
        await fetchApplications();

        showSuccess(`${application.name}'s application has been rejected.`);
      } else {
        await finalDecision(application._id, type);
        await fetchApplications();

        if (type === "pass") {
          showSuccess(`${application.name} has been accepted.`);
        } else {
          showSuccess(`${application.name} has been declined.`);
        }
      }
    } catch (err) {
      if (type === "reject") {
        setActionError(
          err?.response?.data?.message ||
            "Failed to reject application"
        );
      } else {
        const action = type === "pass" ? "accept" : "decline";

        setActionError(
          err?.response?.data?.message ||
            `Failed to ${action} applicant`
        );
      }
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

      {/* Error message card */}
      {(error || actionError) && (
        <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 flex items-start gap-3">
          <div className="text-danger text-lg">!</div>

          <div className="flex-1">
            <p className="font-medium text-danger">Something went wrong</p>
            <p className="text-sm text-text-secondary mt-1">
              {error || actionError}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setActionError("");
            }}
            className="text-text-secondary hover:text-text-primary text-lg"
          >
            ×
          </button>
        </div>
      )}

      {/* Success message card */}
      {actionSuccess && (
        <div className="mb-4 rounded-lg border border-emerald/30 bg-emerald/10 px-4 py-3 flex items-start gap-3">
          <div className="text-emerald text-lg">✓</div>

          <div className="flex-1">
            <p className="font-medium text-emerald">Success</p>
            <p className="text-sm text-text-secondary mt-1">
              {actionSuccess}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActionSuccess("")}
            className="text-text-secondary hover:text-text-primary text-lg"
          >
            ×
          </button>
        </div>
      )}

      {/* Confirmation message card */}
      {confirmation && (
        <div className="mb-4 rounded-lg border border-gold/30 bg-gold/10 px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="text-gold text-xl">!</div>

            <div className="flex-1">
              <h4 className="font-semibold text-text-primary">
                {confirmation.title}
              </h4>

              <p className="text-sm text-text-secondary mt-1">
                {confirmation.message}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={executeConfirmation}
                  disabled={actioningId === confirmation.application._id}
                  className={
                    confirmation.type === "reject" ||
                    confirmation.type === "fail"
                      ? "px-4 py-2 rounded-lg bg-danger text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
                      : "px-4 py-2 rounded-lg bg-emerald text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  }
                >
                  {confirmation.confirmText}
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmation(null)}
                  disabled={actioningId === confirmation.application._id}
                  className="px-4 py-2 rounded-lg border border-border text-text-secondary text-sm font-medium hover:bg-background disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setConfirmation(null)}
              className="text-text-secondary hover:text-text-primary text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Table
        isLoading={loading}
        data={visibleApplications}
        emptyMessage="No applications found"
        columns={[
          {
            key: "name",
            label: "Name",
          },

          {
            key: "email",
            label: "Email",
          },

          {
            key: "department",
            label: "Department",
          },

          {
            key: "status",
            label: "Status",
            render: (row) => (
              <span>
                {row.status}

                {row.status === "Interview Completed" &&
                  row.mentorRecommendation && (
                    <span
                      className={
                        row.mentorRecommendation === "pass"
                          ? "text-emerald text-xs ml-1"
                          : "text-danger text-xs ml-1"
                      }
                    >
                      (mentor: {row.mentorRecommendation})
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
                      {actioningId === row._id
                        ? "Processing..."
                        : "Approve"}
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
                    {row.assignedMentor
                      ? "Reassign Mentor"
                      : "Assign Mentor"}
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

      {/* Application details modal */}
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
              <span className="text-text-secondary">
                Academic year:
              </span>{" "}
              {selected.academicYear}
            </p>

            <p>
              <span className="text-text-secondary">
                Department:
              </span>{" "}
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
              <span className="text-text-secondary">
                Assigned mentor:
              </span>{" "}
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
                <span className="text-text-secondary">
                  Codeforces:
                </span>{" "}
                {selected.codeforcesHandle}
              </p>
            )}

            {selected.leetcodeHandle && (
              <p>
                <span className="text-text-secondary">
                  LeetCode:
                </span>{" "}
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
              <p className="text-text-secondary mb-1">
                Motivation:
              </p>

              <p className="whitespace-pre-wrap">
                {selected.motivation}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <AssignApplicationMentorModal
        application={assigning}
        onClose={() => setAssigning(null)}
        onAssigned={fetchApplications}
      />
    </div>
  );
}