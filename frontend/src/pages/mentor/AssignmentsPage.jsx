import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getAssignments,
  updateAssignment,
  deleteAssignment,
} from "../../api/assignment.api";
import { getSubmissions } from "../../api/submission.api";
import AssignmentForm from "../../components/mentor/AssignmentForm";
import GradingPanel from "./GradingPanel";

export default function AssignmentsPage({ batchId }) {
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  // ======================================================
  // LOAD ASSIGNMENTS
  // ======================================================

  const loadAssignments = async () => {
    try {
      setLoadingAssignments(true);

      const res = await getAssignments({ batchId });

      console.log("ASSIGNMENTS RESPONSE:", res.data);

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

      console.log("OPENING ASSIGNMENT:", assignment);

      const res = await getSubmissions({
        assignmentId: assignment._id,
      });

      console.log("SUBMISSIONS RESPONSE:", res.data);

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
      const res = await getSubmissions({
        assignmentId: selected._id,
      });

      setSubmissions(res.data.data || []);
    } catch (err) {
      console.error("FAILED TO REFRESH SUBMISSIONS:", err);
    }
  };

  // ======================================================
  // START EDITING
  // ======================================================

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setShowForm(false);
  };

  // ======================================================
  // UPDATE ASSIGNMENT
  // ======================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingAssignment) return;

    try {
      setActionLoading(true);

      const payload = {
        title: editingAssignment.title,
        instructions: editingAssignment.instructions,
        deadline: editingAssignment.deadline,
        maxScore: Number(editingAssignment.maxScore),
        batch: editingAssignment.batch,
      };

      console.log("UPDATING ASSIGNMENT:", payload);

      const res = await updateAssignment(
        editingAssignment._id,
        payload
      );

      console.log("UPDATED ASSIGNMENT:", res.data);

      const updatedAssignment = res.data.data;

      setAssignments((current) =>
        current.map((assignment) =>
          assignment._id === updatedAssignment._id
            ? updatedAssignment
            : assignment
        )
      );

      // Keep the selected assignment updated if
      // the mentor is currently viewing it.
      if (selected?._id === updatedAssignment._id) {
        setSelected(updatedAssignment);
      }

      setEditingAssignment(null);

      // Reload to guarantee the UI matches the backend.
      await loadAssignments();
    } catch (err) {
      console.error("FAILED TO UPDATE ASSIGNMENT:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to update assignment."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ======================================================
  // DELETE ASSIGNMENT
  // ======================================================

  const handleDelete = async (assignment) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${assignment.title}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      console.log(
        "DELETING ASSIGNMENT:",
        assignment._id
      );

      await deleteAssignment(assignment._id);

      // Remove it immediately from the list.
      setAssignments((current) =>
        current.filter(
          (item) => item._id !== assignment._id
        )
      );

      // If the deleted assignment was selected,
      // clear the grading/submission panel.
      if (selected?._id === assignment._id) {
        setSelected(null);
        setSubmissions([]);
      }

      // Close edit mode if necessary.
      if (
        editingAssignment?._id === assignment._id
      ) {
        setEditingAssignment(null);
      }

      await loadAssignments();
    } catch (err) {
      console.error("FAILED TO DELETE ASSIGNMENT:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to delete assignment."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ======================================================
  // CANCEL EDIT
  // ======================================================

  const cancelEdit = () => {
    setEditingAssignment(null);
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

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
          onClick={() => {
            setEditingAssignment(null);
            setShowForm((value) => !value);
          }}
          disabled={actionLoading}
          className="text-sm px-4 py-2 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-50"
        >
          {showForm ? "Close" : "New Assignment"}
        </button>
      </div>

      {/* ==================================================
          CREATE ASSIGNMENT FORM
      ================================================== */}

      {showForm && (
        <div className="mb-6">
          <AssignmentForm
            batchId={batchId}
            onCreated={async () => {
              setShowForm(false);
              await loadAssignments();
            }}
          />
        </div>
      )}

      {/* ==================================================
          EDIT ASSIGNMENT FORM
      ================================================== */}

      {editingAssignment && (
        <motion.form
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          onSubmit={handleUpdate}
          className="glass-card glow-border rounded-xl p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-gold">
                Mentor
              </p>

              <h2 className="text-lg font-semibold text-text-primary">
                Edit Assignment
              </h2>
            </div>

            <button
              type="button"
              onClick={cancelEdit}
              disabled={actionLoading}
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
          </div>

          <div className="grid gap-4">

            {/* TITLE */}

            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Title
              </label>

              <input
                type="text"
                value={editingAssignment.title || ""}
                onChange={(e) =>
                  setEditingAssignment((current) => ({
                    ...current,
                    title: e.target.value,
                  }))
                }
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-gold/50"
              />
            </div>

            {/* INSTRUCTIONS */}

            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Instructions
              </label>

              <textarea
                value={
                  editingAssignment.instructions || ""
                }
                onChange={(e) =>
                  setEditingAssignment((current) => ({
                    ...current,
                    instructions: e.target.value,
                  }))
                }
                required
                rows={5}
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-gold/50"
              />
            </div>

            {/* DEADLINE + MAX SCORE */}

            <div className="grid sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm text-text-secondary mb-1">
                  Deadline
                </label>

                <input
                  type="datetime-local"
                  value={
                    editingAssignment.deadline
                      ? new Date(
                          editingAssignment.deadline
                        )
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEditingAssignment((current) => ({
                      ...current,
                      deadline: e.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-gold/50"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1">
                  Maximum Score
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    editingAssignment.maxScore ?? ""
                  }
                  onChange={(e) =>
                    setEditingAssignment((current) => ({
                      ...current,
                      maxScore: e.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-gold/50"
                />
              </div>
            </div>

            {/* UPDATE */}

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full rounded-lg bg-gradient-to-r from-gold to-emerald px-4 py-3 text-sm font-bold text-obsidian disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading
                ? "Updating..."
                : "Save Changes"}
            </button>
          </div>
        </motion.form>
      )}

      {/* ==================================================
          ASSIGNMENTS + SUBMISSIONS
      ================================================== */}

      <div className="grid md:grid-cols-2 gap-6">

        {/* ==================================================
            ASSIGNMENT LIST
        ================================================== */}

        <div className="glass-card glow-border rounded-xl p-5">

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-text-primary font-semibold">
              All Assignments
            </h2>

            {loadingAssignments && (
              <span className="text-xs text-text-secondary">
                Loading...
              </span>
            )}
          </div>

          <div className="space-y-3">

            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className={`rounded-lg border transition-colors ${
                  selected?._id === assignment._id
                    ? "border-gold bg-gold/10"
                    : "border-border"
                }`}
              >

                {/* ASSIGNMENT SELECT */}

                <button
                  onClick={() =>
                    openAssignment(assignment)
                  }
                  className="w-full text-left p-3 hover:bg-gold/5 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">
                      <p className="text-text-primary text-sm font-medium">
                        {assignment.title}
                      </p>

                      <p className="text-text-secondary text-xs mt-1">
                        Due{" "}
                        {new Date(
                          assignment.deadline
                        ).toLocaleDateString()}{" "}
                        · Max{" "}
                        {assignment.maxScore}
                      </p>
                    </div>

                  </div>
                </button>

                {/* EDIT / DELETE */}

                <div className="flex items-center gap-2 px-3 pb-3">

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(assignment)
                    }
                    disabled={actionLoading}
                    className="flex-1 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold hover:bg-gold/20 disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(assignment)
                    }
                    disabled={actionLoading}
                    className="flex-1 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-400/20 disabled:opacity-50"
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))}

            {!loadingAssignments &&
              assignments.length === 0 && (
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

          {selected &&
            !loading &&
            submissions.length === 0 && (
              <div className="glass-card glow-border rounded-xl p-5 text-text-secondary text-sm">
                No submissions yet for "
                {selected.title}".
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