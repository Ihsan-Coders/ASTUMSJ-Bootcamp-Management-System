import { useEffect, useState } from "react";
import {
  createSubmission,
  updateSubmission,
} from "../../api/submission.api";

export default function SubmissionForm({
  assignmentId,
  submission = null,
  onSubmitted,
  onCancel,
}) {
  const isEditing = Boolean(submission);

  const [form, setForm] = useState({
    githubUrl: "",
    liveDemoUrl: "",
    notes: "",
  });

  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD EXISTING SUBMISSION WHEN EDITING
  // ==========================================

  useEffect(() => {
    if (submission) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        githubUrl: submission.githubUrl || "",
        liveDemoUrl: submission.liveDemoUrl || "",
        notes: submission.notes || "",
      });

      setFiles([]);
    } else {
      setForm({
        githubUrl: "",
        liveDemoUrl: "",
        notes: "",
      });

      setFiles([]);
    }
  }, [submission]);

  // ==========================================
  // SUBMIT / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("githubUrl", form.githubUrl.trim());
      formData.append("liveDemoUrl", form.liveDemoUrl.trim());
      formData.append("notes", form.notes.trim());

      files.forEach((file) => {
        formData.append("attachments", file);
      });

      if (isEditing) {
        // UPDATE EXISTING SUBMISSION
        await updateSubmission(submission._id, formData);
      } else {
        // CREATE NEW SUBMISSION
        formData.append("assignment", assignmentId);

        await createSubmission(formData);
      }

      onSubmitted?.();
    } catch (err) {
      console.error(
        isEditing
          ? "Failed to update submission:"
          : "Failed to submit assignment:",
        err,
      );

      setError(
        err?.response?.data?.message ||
          (isEditing
            ? "Failed to update submission."
            : "Submission failed"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card glow-border rounded-lg p-4 sm:p-6 space-y-4"
    >
      {/* ERROR */}

      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger/10 p-3">
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      {/* GITHUB */}

      <div>
        <label className="block text-xs sm:text-sm text-text-secondary mb-1">
          GitHub URL
        </label>

        <input
          type="url"
          placeholder="https://github.com/username/project"
          value={form.githubUrl}
          onChange={(e) =>
            setForm({
              ...form,
              githubUrl: e.target.value,
            })
          }
          className="w-full min-w-0 p-2.5 rounded border border-border bg-background text-text-primary outline-none focus:border-gold"
        />
      </div>

      {/* LIVE DEMO */}

      <div>
        <label className="block text-xs sm:text-sm text-text-secondary mb-1">
          Live Demo URL{" "}
          <span className="text-text-secondary/60">(optional)</span>
        </label>

        <input
          type="url"
          placeholder="https://your-project.vercel.app"
          value={form.liveDemoUrl}
          onChange={(e) =>
            setForm({
              ...form,
              liveDemoUrl: e.target.value,
            })
          }
          className="w-full min-w-0 p-2.5 rounded border border-border bg-background text-text-primary outline-none focus:border-gold"
        />
      </div>

      {/* NOTES */}

      <div>
        <label className="block text-xs sm:text-sm text-text-secondary mb-1">
          Notes
        </label>

        <textarea
          placeholder="Add any notes about your submission..."
          value={form.notes}
          onChange={(e) =>
            setForm({
              ...form,
              notes: e.target.value,
            })
          }
          rows={4}
          className="w-full min-w-0 p-2.5 rounded border border-border bg-background text-text-primary outline-none focus:border-gold resize-y"
        />
      </div>

      {/* EXISTING ATTACHMENTS */}

      {isEditing && submission?.attachments?.length > 0 && (
        <div>
          <label className="block text-xs sm:text-sm text-text-secondary mb-2">
            Current Attachments
          </label>

          <div className="space-y-2">
            {submission.attachments.map((file) => (
              <a
                key={file.url}
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="block text-sm text-gold hover:underline break-all"
              >
                {file.filename}
              </a>
            ))}
          </div>

          <p className="text-xs text-text-secondary mt-2">
            Select new files below if you want to replace the attachments.
          </p>
        </div>
      )}

      {/* FILES */}

      <div>
        <label className="block text-xs sm:text-sm text-text-secondary mb-1">
          {isEditing ? "New Attachments" : "Attachments"}
        </label>

        <input
          type="file"
          multiple
          onChange={(e) =>
            setFiles(Array.from(e.target.files || []))
          }
          className="w-full min-w-0 text-xs sm:text-sm text-text-secondary file:mr-2 sm:file:mr-3 file:py-2 file:px-2 sm:file:px-3 file:rounded file:border-0 file:bg-gold/20 file:text-gold"
        />

        <p className="text-xs text-text-secondary mt-1">
          Maximum 3 files.
        </p>
      </div>

      {/* BUTTONS */}

      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-2.5 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
        >
          {submitting
            ? isEditing
              ? "Updating…"
              : "Submitting…"
            : isEditing
              ? "Update Submission"
              : "Submit Assignment"}
        </button>

        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="sm:w-auto px-5 py-2.5 rounded border border-border text-text-secondary hover:text-text-primary hover:bg-border/10 disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}