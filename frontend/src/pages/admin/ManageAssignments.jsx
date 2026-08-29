import { useEffect, useState } from "react";
import { useConfirm } from "../../context/ConfirmContext";
import {
  getAssignments,
  updateAssignment,
  deleteAssignment,
} from "../../api/assignment.api";
import { getBatches } from "../../api/batch.api";
import AssignmentForm from "../../components/admin/AssignmentForm";

export default function ManageAssignments() {
  const confirm = useConfirm();
  const [assignments, setAssignments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [batchFilter, setBatchFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAssignments = () => {
    setLoading(true);
    const params = batchFilter !== "all" ? { batchId: batchFilter } : undefined;
    getAssignments(params)
      .then((res) => {
        setAssignments(res.data.data || []);
        setError("");
      })
      .catch((err) =>
        setError(err?.response?.data?.message || "Failed to load assignments"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getBatches()
      .then((res) => setBatches(res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchFilter]);

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setShowForm(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingAssignment) return;

    setActionLoading(true);
    try {
      const payload = {
        title: editingAssignment.title,
        instructions: editingAssignment.instructions,
        deadline: editingAssignment.deadline,
        maxScore: Number(editingAssignment.maxScore),
        batch: editingAssignment.batch,
      };

      await updateAssignment(editingAssignment._id, payload);
      setEditingAssignment(null);
      loadAssignments();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update assignment");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (assignment) => {
    const ok = await confirm(`Delete "${assignment.title}"?`, {
      title: "Delete assignment",
      confirmLabel: "Delete",
    });
    if (!ok) return;

    setActionLoading(true);
    try {
      await deleteAssignment(assignment._id);
      if (editingAssignment?._id === assignment._id) setEditingAssignment(null);
      loadAssignments();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete assignment");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)]">
          Assignments
        </h1>

        <div className="flex gap-2">
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="p-2 rounded border border-border bg-background text-text-primary text-sm"
          >
            <option value="all">All batches</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setEditingAssignment(null);
              setShowForm((v) => !v);
            }}
            disabled={actionLoading}
            className="text-sm px-4 py-2 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-50"
          >
            {showForm ? "Close" : "New Assignment"}
          </button>
        </div>
      </div>

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      {showForm && (
        <div className="mb-6">
          <AssignmentForm
            onCreated={() => {
              setShowForm(false);
              loadAssignments();
            }}
          />
        </div>
      )}

      {editingAssignment && (
        <form
          onSubmit={handleUpdate}
          className="glass-card glow-border rounded-xl p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-text-primary">
              Edit Assignment
            </h2>
            <button
              type="button"
              onClick={() => setEditingAssignment(null)}
              disabled={actionLoading}
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Title
              </label>
              <input
                type="text"
                value={editingAssignment.title || ""}
                onChange={(e) =>
                  setEditingAssignment((c) => ({ ...c, title: e.target.value }))
                }
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-gold/50"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Instructions
              </label>
              <textarea
                value={editingAssignment.instructions || ""}
                onChange={(e) =>
                  setEditingAssignment((c) => ({
                    ...c,
                    instructions: e.target.value,
                  }))
                }
                required
                rows={5}
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-gold/50"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  value={
                    editingAssignment.deadline
                      ? new Date(editingAssignment.deadline)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEditingAssignment((c) => ({
                      ...c,
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
                  value={editingAssignment.maxScore ?? ""}
                  onChange={(e) =>
                    setEditingAssignment((c) => ({
                      ...c,
                      maxScore: e.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-gold/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full rounded-lg bg-gradient-to-r from-gold to-emerald px-4 py-3 text-sm font-bold text-obsidian disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      <div className="glass-card glow-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-text-primary font-semibold">All Assignments</h2>
          {loading && (
            <span className="text-xs text-text-secondary">Loading...</span>
          )}
        </div>

        <div className="space-y-3">
          {assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="rounded-lg border border-border p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-text-primary text-sm font-medium">
                    {assignment.title}
                  </p>
                  <p className="text-text-secondary text-xs mt-1">
                    Due {new Date(assignment.deadline).toLocaleDateString()} ·
                    Max {assignment.maxScore}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => handleEdit(assignment)}
                  disabled={actionLoading}
                  className="flex-1 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold hover:bg-gold/20 disabled:opacity-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(assignment)}
                  disabled={actionLoading}
                  className="flex-1 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/20 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {!loading && assignments.length === 0 && (
            <p className="text-text-secondary text-sm">No assignments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
