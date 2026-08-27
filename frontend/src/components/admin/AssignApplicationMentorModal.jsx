import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { getUsers } from "../../api/user.api";
import { assignApplicationMentor } from "../../api/application.api";

export default function AssignApplicationMentorModal({
  application,
  onClose,
  onAssigned,
}) {
  const isOpen = !!application;

  const [mentors, setMentors] = useState([]);
  const [mentorId, setMentorId] = useState("");
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    // Reset state whenever the modal opens
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMentorId("");
    setError("");
    setSuccess("");
    setLoadingMentors(true);

    getUsers({ role: "mentor" })
      .then((res) => {
        if (cancelled) return;
        setMentors(res.data.data);
      })
      .catch((err) => {
        if (cancelled) return;

        setError(
          err?.response?.data?.message || "Failed to load mentors"
        );
      })
      .finally(() => {
        if (!cancelled) setLoadingMentors(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!mentorId) {
      setError("Please choose a mentor before assigning.");
      return;
    }

    setSubmitting(true);

    try {
      await assignApplicationMentor(application._id, mentorId);

      setSuccess(
        `${application.name}'s application has been assigned to the selected mentor.`
      );

      onAssigned?.();

      // Close after a short delay so the user can see the success message
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to assign mentor"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        application
          ? `Assign Mentor — ${application.name}`
          : "Assign Mentor"
      }
      footer={
        <>
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded text-sm text-text-secondary hover:text-text-primary disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting || loadingMentors}
            className="px-4 py-2 rounded text-sm font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
          >
            {submitting ? "Assigning…" : "Assign"}
          </button>
        </>
      }
    >
      {loadingMentors ? (
        <p className="text-text-secondary text-sm">
          Loading mentors…
        </p>
      ) : (
        <div className="space-y-3">
          {/* Error message card */}
          {error && (
            <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 flex items-start gap-3">
              <div className="text-danger text-lg">!</div>

              <div className="flex-1">
                <p className="font-medium text-danger">
                  Unable to assign mentor
                </p>

                <p className="text-sm text-text-secondary mt-1">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                className="text-text-secondary hover:text-text-primary text-lg"
              >
                ×
              </button>
            </div>
          )}

          {/* Success message card */}
          {success && (
            <div className="rounded-lg border border-emerald/30 bg-emerald/10 px-4 py-3 flex items-start gap-3">
              <div className="text-emerald text-lg">✓</div>

              <div className="flex-1">
                <p className="font-medium text-emerald">
                  Mentor Assigned
                </p>

                <p className="text-sm text-text-secondary mt-1">
                  {success}
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-text-secondary mb-1">
              Mentor
            </label>

            <select
              value={mentorId}
              onChange={(e) => {
                setMentorId(e.target.value);
                setError("");
              }}
              disabled={submitting}
              className="w-full p-2 rounded border border-border bg-background text-text-primary disabled:opacity-60"
            >
              <option value="" disabled>
                Select a mentor
              </option>

              {mentors.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>

            {mentors.length === 0 && (
              <p className="text-xs text-text-secondary mt-1">
                No mentor accounts exist yet.
              </p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}