import { useEffect, useState } from "react";
import { getResources, deleteResource } from "../api/resource.api";
import { useAuth } from "../context/AuthContext";
import ResourceCard from "../components/resources/ResourceCard";
import ResourceUploadForm from "../components/resources/ResourceUploadForm";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmContext";

const TYPES = ["Link", "Document", "Video"];

export default function ResourceLibraryPage() {
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "mentor";

  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { showToast } = useToast();
  const confirm = useConfirm();

  const fetchResources = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getResources({ search, type: type || undefined });
      setResources(res.data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchResources, 300); // debounce search input
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, type]);

  const handleDelete = async (resource) => {
    const confirmed = await confirm(`Delete "${resource.title}"?`, {
      title: "Delete Resource",
      confirmLabel: "Delete",
    });
    if (!confirmed) return;

    setDeletingId(resource._id);
    try {
      await deleteResource(resource._id);
      setResources((current) => current.filter((r) => r._id !== resource._id));
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete resource", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Resource Library
        </h1>

        {canManage && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="text-sm px-4 py-2 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald"
          >
            {showForm ? "Close" : "Add Resource"}
          </button>
        )}
      </div>

      {canManage && showForm && (
        <div className="mb-6">
          <ResourceUploadForm
            onCreated={() => {
              setShowForm(false);
              fetchResources();
            }}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded border border-border bg-background text-text-primary"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-3 rounded border border-border bg-background text-text-primary sm:w-48"
        >
          <option value="">All types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {loading && <Loader />}

      {!loading && error && (
        <p className="text-red-400 text-sm text-center py-6">{error}</p>
      )}

      {!loading && !error && resources.length === 0 && (
        <EmptyState message="No resources found." icon="📚" />
      )}

      {!loading && !error && resources.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {resources.map((r) => (
            <ResourceCard
              key={r._id}
              resource={r}
              canDelete={
                canManage &&
                (user.role === "admin" || r.uploadedBy?._id === user.id || r.uploadedBy === user.id)
              }
              deleting={deletingId === r._id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
