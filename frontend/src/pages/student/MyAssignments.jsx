import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  RotateCcw,
  X,
} from "lucide-react";

import { getAssignments } from "../../api/assignment.api";
import { getSubmissions } from "../../api/submission.api";
import { useAuth } from "../../context/AuthContext";
import SubmissionForm from "./SubmissionForm";

// ======================================================
// STATUS CONFIG
// ======================================================

const STATUS_CONFIG = {
  Graded: {
    label: "Graded",
    icon: CheckCircle2,
    className: "text-emerald bg-emerald/10 border-emerald/30",
  },

  Submitted: {
    label: "Submitted",
    icon: Clock3,
    className: "text-gold bg-gold/10 border-gold/30",
  },

  "Resubmission Requested": {
    label: "Resubmission Requested",
    icon: RotateCcw,
    className: "text-warning bg-warning/10 border-warning/30",
  },

  "Not Submitted": {
    label: "Not Submitted",
    icon: Clock3,
    className: "text-text-secondary bg-border/20 border-border",
  },
};

function StatusBadge({ status }) {
  const config =
    STATUS_CONFIG[status] || STATUS_CONFIG["Not Submitted"];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${config.className}`}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}

export default function MyAssignments() {
  const { user } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Whether the student is currently editing the selected submission
  const [editingSubmission, setEditingSubmission] = useState(false);

  // ======================================================
  // LOAD ASSIGNMENTS + MY SUBMISSIONS
  // ======================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [assignmentsRes, submissionsRes] = await Promise.all([
        getAssignments(),
        getSubmissions({ studentId: user.id }),
      ]);

      setAssignments(assignmentsRes.data?.data || []);
      setSubmissions(submissionsRes.data?.data || []);
    } catch (err) {
      console.error("Failed to load assignments:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your assignments. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ======================================================
  // MAP SUBMISSIONS BY ASSIGNMENT ID
  // ======================================================

  const submissionByAssignment = useMemo(() => {
    const map = {};

    submissions.forEach((submission) => {
      const assignmentId =
        submission.assignment?._id || submission.assignment;

      map[assignmentId] = submission;
    });

    return map;
  }, [submissions]);

  // ======================================================
  // SELECTED SUBMISSION
  // ======================================================

  const selectedSubmission = selectedAssignment
    ? submissionByAssignment[selectedAssignment._id]
    : null;

  // ======================================================
  // AFTER SUBMISSION / UPDATE
  // ======================================================

  const handleSubmitted = async () => {
    setEditingSubmission(false);
    setSelectedAssignment(null);

    await loadData();
  };

  // ======================================================
  // CLOSE MODAL
  // ======================================================

  const closeModal = () => {
    setSelectedAssignment(null);
    setEditingSubmission(false);
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)]"
        >
          My Assignments
        </motion.h1>
      </div>

      {/* LOADING STATE */}

      {loading && (
        <div className="glass-card glow-border rounded-xl p-6 text-text-secondary text-sm">
          Loading your assignments...
        </div>
      )}

      {/* ERROR STATE */}

      {!loading && error && (
        <div className="glass-card glow-border rounded-xl p-6 text-danger text-sm">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}

      {!loading && !error && assignments.length === 0 && (
        <div className="glass-card glow-border rounded-xl p-6 text-text-secondary text-sm">
          No assignments have been posted for your batch yet.
        </div>
      )}

      {/* ASSIGNMENT LIST */}

      {!loading && !error && assignments.length > 0 && (
        <div className="grid gap-4">
          {assignments.map((assignment) => {
            const submission =
              submissionByAssignment[assignment._id];

            const status = submission
              ? submission.status
              : "Not Submitted";

            const isPastDeadline =
              assignment.deadline &&
              new Date(assignment.deadline) < new Date();

            return (
              <div
                key={assignment._id}
                className="glass-card glow-border rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-text-primary font-semibold">
                      {assignment.title}
                    </p>

                    <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                      <CalendarClock size={12} />

                      Due{" "}
                      {assignment.deadline
                        ? new Date(
                            assignment.deadline,
                          ).toLocaleString()
                        : "No deadline"}{" "}
                      · Max {assignment.maxScore}

                      {isPastDeadline &&
                        status === "Not Submitted" && (
                          <span className="text-danger ml-1">
                            (Past due)
                          </span>
                        )}
                    </p>

                    {submission?.status === "Graded" && (
                      <p className="text-xs text-emerald mt-1">
                        Score: {submission.score}/
                        {assignment.maxScore}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={status} />

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAssignment(assignment)
                      }
                      className="text-xs px-3 py-1.5 rounded-lg text-gold border border-gold/30 hover:bg-gold/10 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================
          ASSIGNMENT DETAIL MODAL
          ====================================================== */}

      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card glow-border rounded-xl p-6 w-full max-w-2xl my-8"
          >
            {/* MODAL HEADER */}

            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  {selectedAssignment.title}
                </h2>

                <p className="text-sm text-text-secondary mt-1">
                  Maximum Score: {selectedAssignment.maxScore}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-text-secondary hover:text-text-primary"
                aria-label="Close assignment"
              >
                <X size={20} />
              </button>
            </div>

            {/* DESCRIPTION */}

            <div className="mt-6">
              <h3 className="text-text-primary font-semibold">
                Description
              </h3>

              <p className="text-text-secondary text-sm mt-2 whitespace-pre-line">
                {selectedAssignment.description}
              </p>
            </div>

            {/* INSTRUCTIONS */}

            {selectedAssignment.instructions && (
              <div className="mt-5">
                <h3 className="text-text-primary font-semibold">
                  Instructions
                </h3>

                <p className="text-text-secondary text-sm mt-2 whitespace-pre-line">
                  {selectedAssignment.instructions}
                </p>
              </div>
            )}

            {/* DEADLINE */}

            <div className="mt-5">
              <p className="text-sm text-text-secondary">
                Deadline:{" "}
                <span className="text-text-primary">
                  {selectedAssignment.deadline
                    ? new Date(
                        selectedAssignment.deadline,
                      ).toLocaleString()
                    : "No deadline"}
                </span>
              </p>
            </div>

            {/* ==================================================
                EXISTING SUBMISSION
                ================================================== */}

            {selectedSubmission && (
              <div className="border-t border-border/50 mt-6 pt-6">
                <div className="flex items-center justify-between mb-3 gap-3">
                  <h3 className="text-text-primary font-semibold">
                    Your Submission
                  </h3>

                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={selectedSubmission.status}
                    />

                    {/* EDIT BUTTON */}

                    {selectedSubmission.status !== "Graded" && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingSubmission(true)
                        }
                        className="text-xs px-3 py-1.5 rounded-lg text-gold border border-gold/30 hover:bg-gold/10 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* SUBMISSION DETAILS */}

                <div className="space-y-2 text-sm">
                  {selectedSubmission.githubUrl && (
                    <p className="text-text-secondary">
                      GitHub:{" "}
                      <a
                        href={selectedSubmission.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gold hover:underline break-all"
                      >
                        {selectedSubmission.githubUrl}
                      </a>
                    </p>
                  )}

                  {selectedSubmission.liveDemoUrl && (
                    <p className="text-text-secondary">
                      Live Demo:{" "}
                      <a
                        href={selectedSubmission.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gold hover:underline break-all"
                      >
                        {selectedSubmission.liveDemoUrl}
                      </a>
                    </p>
                  )}

                  {selectedSubmission.notes && (
                    <p className="text-text-secondary whitespace-pre-line">
                      Notes: {selectedSubmission.notes}
                    </p>
                  )}

                  {selectedSubmission.attachments?.length > 0 && (
                    <div className="text-text-secondary">
                      Attachments:

                      <ul className="list-disc list-inside mt-1">
                        {selectedSubmission.attachments.map(
                          (file) => (
                            <li key={file.url}>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gold hover:underline break-all"
                              >
                                {file.filename}
                              </a>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  <p className="text-text-secondary text-xs">
                    Submitted{" "}
                    {selectedSubmission.submittedAt
                      ? new Date(
                          selectedSubmission.submittedAt,
                        ).toLocaleString()
                      : ""}
                  </p>
                </div>

                {/* GRADE */}

                {selectedSubmission.status === "Graded" && (
                  <div className="mt-4 rounded-lg border border-emerald/30 bg-emerald/10 p-4">
                    <p className="text-emerald font-semibold">
                      Score: {selectedSubmission.score}/
                      {selectedAssignment.maxScore}
                    </p>

                    {selectedSubmission.feedback && (
                      <p className="text-text-secondary text-sm mt-2 whitespace-pre-line">
                        {selectedSubmission.feedback}
                      </p>
                    )}
                  </div>
                )}

                {/* RESUBMISSION REQUEST */}

                {selectedSubmission.status ===
                  "Resubmission Requested" && (
                  <div className="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-4">
                    <p className="text-warning font-semibold">
                      Resubmission Requested
                    </p>

                    {selectedSubmission.feedback && (
                      <p className="text-text-secondary text-sm mt-2 whitespace-pre-line">
                        {selectedSubmission.feedback}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================
                SUBMISSION / EDIT FORM
                ================================================== */}

            {(!selectedSubmission || editingSubmission) && (
              <div className="border-t border-border/50 mt-6 pt-6">
                <h3 className="text-text-primary font-semibold mb-4">
                  {editingSubmission
                    ? "Edit Submission"
                    : "Submit Assignment"}
                </h3>

                <SubmissionForm
                  assignmentId={selectedAssignment._id}
                  submission={
                    editingSubmission
                      ? selectedSubmission
                      : null
                  }
                  onSubmitted={handleSubmitted}
                  onCancel={() =>
                    setEditingSubmission(false)
                  }
                />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}