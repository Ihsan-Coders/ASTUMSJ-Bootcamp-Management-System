import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAssignments } from "../../api/assignment.api";
import { getSubmissions } from "../../api/submission.api";
import AssignmentForm from "../../components/mentor/AssignmentForm";
import GradingPanel from "./GradingPanel";

export default function AssignmentsPage({ batchId }) {
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadAssignments = async () => {
    try {
      const res = await getAssignments({ batchId });

      console.log("ASSIGNMENTS RESPONSE:", res.data);

      setAssignments(res.data.data || []);
    } catch (err) {
      console.error("FAILED TO LOAD ASSIGNMENTS:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  const openAssignment = async (assignment) => {
    try {
      setLoading(true);

      setSelected(assignment);

      console.log("OPENING ASSIGNMENT:", assignment);

      const res = await getSubmissions({
        assignmentId: assignment._id,
      });

      console.log("SUBMISSIONS RESPONSE:", res.data);

      console.log("SUBMISSIONS:", res.data.data);

      setSubmissions(res.data.data || []);
    } catch (err) {
      console.error("FAILED TO LOAD SUBMISSIONS:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubmissions = async () => {
    if (!selected) return;

    console.log("REFRESHING SUBMISSIONS AFTER GRADING...");

    try {
      const res = await getSubmissions({
        assignmentId: selected._id,
      });

      console.log("REFRESHED SUBMISSIONS:", res.data.data);

      setSubmissions(res.data.data || []);
    } catch (err) {
      console.error("FAILED TO REFRESH SUBMISSIONS:", err);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-5xl mx-auto">
      {/* ============================ */}
      {/* HEADER */}
      {/* ============================ */}

      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-2xl sm:text-3xl font-bold text-text-primary"
        >
          Assignments
        </motion.h1>

        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-sm px-4 py-2 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald"
        >
          {showForm ? "Close" : "New Assignment"}
        </button>
      </div>

      {/* ============================ */}
      {/* CREATE ASSIGNMENT FORM */}
      {/* ============================ */}

      {showForm && (
        <div className="mb-6">
          <AssignmentForm
            batchId={batchId}
            onCreated={() => {
              setShowForm(false);
              loadAssignments();
            }}
          />
        </div>
      )}

      {/* ============================ */}
      {/* ASSIGNMENTS + SUBMISSIONS */}
      {/* ============================ */}

      <div className="grid md:grid-cols-2 gap-6">
        {/* ============================ */}
        {/* ASSIGNMENTS LIST */}
        {/* ============================ */}

        <div className="glass-card glow-border rounded-xl p-5">
          <h2 className="text-text-primary font-semibold mb-4">
            All Assignments
          </h2>

          <div className="space-y-2">
            {assignments.map((assignment) => (
              <button
                key={assignment._id}
                onClick={() => openAssignment(assignment)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selected?._id === assignment._id
                    ? "border-gold bg-gold/10"
                    : "border-border hover:border-gold/40"
                }`}
              >
                <p className="text-text-primary text-sm font-medium">
                  {assignment.title}
                </p>

                <p className="text-text-secondary text-xs mt-0.5">
                  Due {new Date(assignment.deadline).toLocaleDateString()} · Max{" "}
                  {assignment.maxScore}
                </p>
              </button>
            ))}

            {assignments.length === 0 && (
              <p className="text-text-secondary text-sm">No assignments yet.</p>
            )}
          </div>
        </div>

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
