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
  isSession: false,
  sessionDate: "",
};

const toDatetimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 16);
};

const toFormValues = (announcement) => ({
  title: announcement?.title || "",
  content: announcement?.content || "",
  targetAudience: announcement?.targetAudience || "All",
  batch: announcement?.batch?._id || announcement?.batch || "",
  isSession: Boolean(announcement?.isSession),
  sessionDate: toDatetimeLocal(announcement?.sessionDate),
});

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

  useEffect(() => {
    let cancelled = false;

    getBatches()
      .then((res) => {
        if (cancelled) return;

        setBatches(res.data?.data || []);
      })
      .catch(() => {
        if (cancelled) return;

        setBatches([]);
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingBatches(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAudienceChange = (value) => {
    setForm((current) => ({
      ...current,
      targetAudience: value,
      batch:
        value === "SpecificBatch" || current.isSession
          ? current.batch
          : "",
    }));
  };

  const handleSessionToggle = (checked) => {
    setForm((current) => ({
      ...current,
      isSession: checked,
      sessionDate: checked ? current.sessionDate : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.targetAudience === "SpecificBatch" && !form.batch) {
      setError("Choose a batch for a batch-specific announcement.");
      return;
    }

    if (form.isSession && !form.sessionDate) {
      setError("Choose the date and time of the class session.");
      return;
    }

    if (form.isSession && !form.batch) {
      setError("A class session must be assigned to a batch.");
      return;
    }

    setSubmitting(true);

    const payload = {
      title: form.title,
      content: form.content,
      targetAudience: form.targetAudience,
      batch:
        form.targetAudience === "SpecificBatch" || form.isSession
          ? form.batch
          : null,
      isSession: form.isSession,
      sessionDate: form.isSession ? form.sessionDate : null,
    };

    try {
      if (mode === "edit") {
        const res = await updateAnnouncement(
          announcement._id,
          payload,
        );

        onSuccess?.(res.data.data);
      } else {
        console.log("DEBUG: form.isSession:", form.isSession, typeof form.isSession);
        console.log("DEBUG: payload before API:", payload);
        const res = await createAnnouncement(payload);

        setForm(EMPTY_FORM);

        onSuccess?.(res.data.data);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          `Failed to ${
            mode === "edit" ? "update" : "create"
          } announcement.`,
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

      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2">
          <p className="text-danger text-sm">{error}</p>
        </div>
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
        <p className="text-text-secondary text-xs mb-2">
          Target audience
        </p>

        <div className="flex flex-wrap gap-2">
          {AUDIENCES.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() => handleAudienceChange(a.value)}
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
              {loadingBatches
                ? "Loading batches..."
                : "Select a batch"}
            </option>

            {batches.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.name}
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

      {/* SESSION SETTINGS */}

      <div className="rounded-lg border border-border bg-surface/30 p-4 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isSession"
            checked={form.isSession}
            onChange={(e) =>
              handleSessionToggle(e.target.checked)
            }
            className="mt-1 accent-gold"
          />

          <div>
            <p className="text-sm font-medium text-text-primary">
              This announcement is a class session
            </p>

            <p className="text-xs text-text-secondary mt-1">
              Automatically add this class to the calendar and make
              it available for attendance marking.
            </p>
          </div>
        </label>

        {form.isSession && (
          <>
            <div>
              <label className="block text-xs text-text-secondary mb-1">
                Session date & time
              </label>

              <input
                type="datetime-local"
                name="sessionDate"
                value={form.sessionDate}
                onChange={handleChange}
                required
                className="w-full p-2.5 rounded border border-border bg-background text-text-primary text-sm"
              />
            </div>

            {!form.batch && (
              <p className="text-xs text-danger">
                Select a specific batch for the class session.
              </p>
            )}
          </>
        )}
      </div>

      <div className="flex gap-2">
        {mode === "edit" && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 py-2.5 rounded font-semibold text-text-secondary border border-border hover:text-text-primary disabled:opacity-50"
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
              ? "Saving..."
              : "Publishing..."
            : mode === "edit"
              ? "Save Changes"
              : "Publish Announcement"}
        </button>
      </div>
    </form>
  );
}