import { useEffect, useState } from "react";
import Table from "../common/Table";
import { getBatches, deleteBatch } from "../../api/batch.api";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";

export default function BatchTable({ refreshKey }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const confirm = useConfirm();

  const fetchBatches = () => {
    setLoading(true);
    getBatches()
      .then((res) => {
        setBatches(res.data.data);
        setError("");
      })
      .catch((err) =>
        setError(err?.response?.data?.message || "Failed to load batches"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBatches();
  }, [refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id) => {
    const confirmed = await confirm("Delete this batch? This cannot be undone.", {
      title: "Delete Batch",
      confirmLabel: "Delete",
    });
    if (!confirmed) return;
    try {
      await deleteBatch(id);
      fetchBatches();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete batch", "error");
    }
  };

  return (
    <div className="glass-card glow-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Batches</h3>

      {error && <p className="text-danger text-sm mb-3">{error}</p>}

      <Table
        isLoading={loading}
        data={batches}
        emptyMessage="No batches found"
        columns={[
          { key: "name", label: "Name" },
          {
            key: "startDate",
            label: "Start Date",
            render: (row) => new Date(row.startDate).toLocaleDateString(),
          },
          {
            key: "endDate",
            label: "End Date",
            render: (row) => new Date(row.endDate).toLocaleDateString(),
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
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  row.isActive
                    ? "bg-emerald/15 text-emerald"
                    : "bg-text-secondary/15 text-text-secondary"
                }`}
              >
                {row.isActive ? "Active" : "Inactive"}
              </span>
            ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <button
                onClick={() => handleDelete(row._id)}
                className="text-danger hover:underline text-sm"
              >
                Delete
              </button>
            ),
          },
        ]}
      />
    </div>
  );
}
