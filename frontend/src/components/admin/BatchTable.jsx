import { useEffect, useState } from "react";
import Table from "../common/Table";
import {
  getBatches,
  deleteBatch,
  setAcceptingBatch,
  updateBatch,
} from "../../api/batch.api";

export default function BatchTable({ refreshKey }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [settingId, setSettingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchBatches = () => {
    setLoading(true);

    getBatches()
      .then((res) => {
        setBatches(res.data.data);
        setError("");
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message || "Failed to load batches",
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBatches();
  }, [refreshKey]); 
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this batch? This cannot be undone.",
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      await deleteBatch(id);
      fetchBatches();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to delete batch",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    setUpdatingId(id);
    setError("");

    try {
      await updateBatch(id, { isActive: !isActive });
      fetchBatches();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          `Failed to ${isActive ? "complete" : "activate"} batch`,
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSetAccepting = async (id) => {
    setSettingId(id);
    setError("");

    try {
      await setAcceptingBatch(id);
      fetchBatches();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to set accepting batch",
      );
    } finally {
      setSettingId(null);
    }
  };

  return (
    <div className="glass-card glow-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Batches
      </h3>

      {error && (
        <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3">
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      <Table
        isLoading={loading}
        data={batches}
        emptyMessage="No batches found"
        columns={[
          {
            key: "name",
            label: "Name",
          },

          {
            key: "startDate",
            label: "Start Date",
            render: (row) =>
              new Date(row.startDate).toLocaleDateString(),
          },

          {
            key: "endDate",
            label: "End Date",
            render: (row) =>
              new Date(row.endDate).toLocaleDateString(),
          },

          {
            key: "students",
            label: "Students",
            render: (row) => row.students?.length || 0,
          },

          {
            key: "mentors",
            label: "Mentors",
            render: (row) => row.mentors?.length || 0,
          },

          {
            key: "status",
            label: "Status",
            render: (row) => (
              <div className="flex items-center gap-1 flex-wrap">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    row.isActive
                      ? "bg-emerald/15 text-emerald"
                      : "bg-text-secondary/15 text-text-secondary"
                  }`}
                >
                  {row.isActive ? "Active" : "Inactive"}
                </span>

                {row.isAcceptingApplicants && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold/15 text-gold">
                    Accepting
                  </span>
                )}
              </div>
            ),
          },

          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex items-center gap-3 flex-wrap">
                {/* Activate / Complete */}
                {row.isActive ? (
                  <button
                    onClick={() =>
                      handleToggleActive(row._id, true)
                    }
                    disabled={updatingId === row._id}
                    className="text-danger hover:underline text-sm disabled:opacity-50"
                  >
                    {updatingId === row._id
                      ? "Updating…"
                      : "Complete"}
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleToggleActive(row._id, false)
                    }
                    disabled={updatingId === row._id}
                    className="text-emerald hover:underline text-sm disabled:opacity-50"
                  >
                    {updatingId === row._id
                      ? "Updating…"
                      : "Activate"}
                  </button>
                )}

                {/* Set accepting */}
                {row.isActive && !row.isAcceptingApplicants && (
                  <button
                    onClick={() =>
                      handleSetAccepting(row._id)
                    }
                    disabled={settingId === row._id}
                    className="text-gold hover:underline text-sm disabled:opacity-50"
                  >
                    {settingId === row._id
                      ? "Updating…"
                      : "Set as Accepting"}
                  </button>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleDelete(row._id)}
                  disabled={deletingId === row._id}
                  className="text-danger hover:underline text-sm disabled:opacity-50"
                >
                  {deletingId === row._id
                    ? "Deleting…"
                    : "Delete"}
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
