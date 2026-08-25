import { useEffect, useState } from "react";
import Table from "../common/Table";
import { getUsers, deleteUser } from "../../api/user.api";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";

const ROLE_OPTIONS = ["all", "admin", "mentor", "student"];

export default function UserTable({ refreshKey }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("all");
  const [search, setSearch] = useState("");
  const { showToast } = useToast();
  const confirm = useConfirm();

  const fetchUsers = () => {
    const params = {};
    if (role !== "all") params.role = role;
    if (search.trim()) params.search = search.trim();
    getUsers(params)
      .then((res) => {
        setUsers(res.data.data);
        setError("");
      })
      .catch((err) =>
        setError(err?.response?.data?.message || "Failed to load users"),
      )
      .finally(() => setLoading(false));
  };

  // Refetch when a create happens upstream (refreshKey bump) or filters change
  useEffect(() => {
    fetchUsers();
  }, [refreshKey, role]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleDelete = async (id) => {
    const confirmed = await confirm("Delete this user? This cannot be undone.", {
      title: "Delete User",
      confirmLabel: "Delete",
    });
    if (!confirmed) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete user", "error");
    }
  };

  return (
    <div className="glass-card glow-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Users</h3>
        <div className="flex gap-2">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 rounded border border-border bg-background text-text-primary text-sm"
            />
          </form>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-2 rounded border border-border bg-background text-text-primary text-sm"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r === "all" ? "All roles" : r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-danger text-sm mb-3">{error}</p>}

      <Table
        isLoading={loading}
        data={users}
        emptyMessage="No users found"
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          {
            key: "batch",
            label: "Batch",
            render: (row) => row.batch?.name || "—",
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
