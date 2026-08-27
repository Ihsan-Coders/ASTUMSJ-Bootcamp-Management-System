import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAssignments } from "../../api/assignment.api";
import { getSubmissions } from "../../api/submission.api";
import GradingPanel from "./GradingPanel";

export default function AssignmentsPage({ batchId }) {
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  // ======================================================
  // LOAD ASSIGNMENTS
  // ======================================================

  const loadAssignments = async () => {
    try {
      setLoadingAssignments(true);

      const res = await getAssignments({ batchId });

      setAssignments(res.data.data || []);
    } catch (err) {
      console.error("FAILED TO LOAD ASSIGNMENTS:", err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  // ======================================================
  // OPEN ASSIGNMENT
  // ======================================================

  const openAssignment = async (assignment) => {
    try {
      setLoading(true);
      setSelected(assignment);

      const res = await getSubmissions({ assignmentId: assignment._id });

      setSubmissions(res.data.data || []);
    } catch (err) {
      console.error("FAILED TO LOAD SUBMISSIONS:", err);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // REFRESH SUBMISSIONS
  // ======================================================

  const refreshSubmissions = async () => {
    if (!selected) return;

    try {
      const res = await getSubmissions({ assignmentId: selected._id });
      setSubmissions(res.data.data || []);
    } catch (err) {
      console.error("FAILED TO REFRESH SUBMISSIONS:", err);
    }
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-text-primary mb-6"
      >
        Assignments
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ==================================================
            ASSIGNMENT LIST (read-only — Admin manages these)
        ================================================== */}

        <div className="glass-card glow-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-text-primary font-semibold">
              All Assignments
            </h2>

            {loadingAssignments && (
              <span className="text-xs text-text-secondary">Loading...</span>
            )}
          </div>

          <div className="space-y-3">
            {assignments.map((assignment) => (
              <button
                key={assignment._id}
                onClick={() => openAssignment(assignment)}
                className={`w-full text-left p-3 rounded-lg border transition-colors hover:bg-gold/5 ${
                  selected?._id === assignment._id
                    ? "border-gold bg-gold/10"
                    : "border-border"
                }`}
              >
                <p className="text-text-primary text-sm font-medium">
                  {assignment.title}
                </p>
                <p className="text-text-secondary text-xs mt-1">
                  Due {new Date(assignment.deadline).toLocaleDateString()} ·
                  Max {assignment.maxScore}
                </p>
              </button>
            ))}

            {!loadingAssignments && assignments.length === 0 && (
              <p className="text-text-secondary text-sm">
                No assignments yet.
              </p>
            )}
          </div>
        </div>

        {/* ==================================================
            SUBMISSIONS / GRADING
        ================================================== */}

        <div className="space-y-4">
          {!selected && (
            <div className="glass-card glow-border rounded-xl p-5 text-text-secondary text-sm">
              Select an assignment to review submissions.
            </div>
          )}

          {selected && loading && (
            <div className="glass-card glow-border rounded-xl p-5 text-text-secondary text-sm">
              Loading submissions...
            </div>
          )}

          {selected && !loading && submissions.length === 0 && (
            <div className="glass-card glow-border rounded-xl p-5 text-text-secondary text-sm">
              No submissions yet for "{selected.title}".
            </div>
          )}

          {selected &&
            !loading &&
            submissions.map((submission) => (
              <GradingPanel
                key={submission._id}
                submission={submission}
                onGraded={refreshSubmissions}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
