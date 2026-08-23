import { useEffect, useState } from "react";
import {
  createAnnouncement,
  updateAnnouncement,
} from "../../api/announcement.api";
import { getBatches } from "../../api/batch.api";

const AUDIENCES = [
  { value: "All", label: "Everyone" },
  { value: "Students", label: "Students Only" },
  { value: "Mentors", label: "Mentors Only" },
  { value: "SpecificBatch", label: "Specific Batch" },
];

const EMPTY_FORM = {
  title: "",
  content: "",
  targetAudience: "All",
  batch: "",
};

const toFormValues = (announcement) => ({
  title: announcement?.title || "",
  content: announcement?.content || "",
  targetAudience: announcement?.targetAudience || "All",
  batch: announcement?.batch?._id || announcement?.batch || "",
});

/**
 * Create or edit an announcement.
 *
 * mode="create" (default): posts a new announcement, resets the form
 *   on success, and calls onSuccess with the created announcement.
 * mode="edit": requires `announcement`, submits a PUT, and calls
 *   onSuccess with the updated announcement. onCancel is shown next
 *   to the submit button.
 */
export default function AnnouncementForm({
  mode = "create",
  announcement = null,
  onSuccess,
  onCancel,
}) {
  const [form, setForm] = useState(
    mode === "edit" ? toFormValues(announcement) : EMPTY_FORM,
  );
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Note: no effect is needed to sync `form` when `announcement` changes —
  // the parent (ManageAnnouncements) always conditionally mounts a fresh
  // AnnouncementForm per announcement being edited, so the useState
  // initializer above already picks up the right values on mount.

  useEffect(() => {
    let cancelled = false;
    getBatches()
      .then((res) => {
        if (cancelled) return;
        setBatches(res.data.data || []);
      })
      .catch(() => {
        if (cancelled) return;
        // Batches are only required for "Specific Batch" targeting —
        // fail silently here, the select will just show no options.
        setBatches([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingBatches(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.targetAudience === "SpecificBatch" && !form.batch) {
      setError("Choose a batch for a batch-specific announcement");
      return;
    }

    setSubmitting(true);
    setError("");

    const payload = {
      title: form.title,
      content: form.content,
      targetAudience: form.targetAudience,
      batch: form.targetAudience === "SpecificBatch" ? form.batch : null,
    };

    try {
      if (mode === "edit") {
        const res = await updateAnnouncement(announcement._id, payload);
        onSuccess?.(res.data.data);
      } else {
        const res = await createAnnouncement(payload);
        setForm(EMPTY_FORM);
        onSuccess?.(res.data.data);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          `Failed to ${mode === "edit" ? "update" : "create"} announcement`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={
        mode === "edit"
          ? "space-y-3"
          : "glass-card glow-border rounded-lg p-6 space-y-3"
      }
    >
      {mode === "create" && (
        <h3 className="text-lg font-semibold text-text-primary">
          New Announcement
        </h3>
      )}

      <div>
        <label className="block text-xs text-text-secondary mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={200}
          className="w-full p-2.5 rounded border border-border bg-background text-text-primary text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-text-secondary mb-1">
          Content
        </label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          required
          rows={4}
          maxLength={5000}
          placeholder="What do you want to announce?"
          className="w-full p-2.5 rounded border border-border bg-background text-text-primary text-sm"
        />
      </div>

      <div>
        <p className="text-text-secondary text-xs mb-2">Target audience</p>
        <div className="flex flex-wrap gap-2">
          {AUDIENCES.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  targetAudience: a.value,
                  batch: a.value === "SpecificBatch" ? current.batch : "",
                }))
              }
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                form.targetAudience === a.value
                  ? "bg-gradient-to-r from-gold to-emerald text-obsidian border-transparent"
                  : "border-border text-text-secondary hover:border-gold/50"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {form.targetAudience === "SpecificBatch" && (
        <div>
          <label className="block text-xs text-text-secondary mb-1">
            Batch
          </label>
          <select
            name="batch"
            value={form.batch}
            onChange={handleChange}
            required
            disabled={loadingBatches}
            className="w-full p-2.5 rounded border border-border bg-background text-text-primary text-sm"
          >
            <option value="" disabled>
              {loadingBatches ? "Loading batches…" : "Select a batch"}
            </option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
          {!loadingBatches && batches.length === 0 && (
            <p className="text-xs text-text-secondary mt-1">
              No batches exist yet.
            </p>
          )}
        </div>
      )}

      {error && <p className="text-danger text-sm">{error}</p>}

      <div className="flex gap-2">
        {mode === "edit" && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded font-semibold text-text-secondary border border-border hover:text-text-primary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-2.5 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
        >
          {submitting
            ? mode === "edit"
              ? "Saving…"
              : "Publishing…"
            : mode === "edit"
              ? "Save Changes"
              : "Publish Announcement"}
        </button>
      </div>
    </form>
  );
}
