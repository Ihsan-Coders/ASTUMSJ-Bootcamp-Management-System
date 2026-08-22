import { useState } from "react";
import { gradeSubmission } from "../../api/submission.api";

export default function GradingPanel({ submission, onGraded }) {
  const [score, setScore] = useState(submission.score ?? "");
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const [status, setStatus] = useState(
    submission.status === "Graded" ? "Graded" : "Graded"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const maxScore = submission.assignment?.maxScore ?? 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (score === "" || Number(score) < 0 || Number(score) > maxScore) {
      setError(`Score must be between 0 and ${maxScore}`);
      return;
    }

    setLoading(true);

    try {
      await gradeSubmission(submission._id, {
        score: Number(score),
        feedback,
        status,
      });

      onGraded?.();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to grade submission"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card glow-border rounded-xl p-5 space-y-4"
    >
      <div>
        <h3 className="text-text-primary font-semibold">
          {submission.student?.name || "Student"}
        </h3>

        <p className="text-text-secondary text-sm">
          {submission.assignment?.title || "Assignment"}
        </p>
      </div>

      {submission.githubUrl && (
        <a
          href={submission.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm text-gold hover:underline"
        >
          View GitHub Submission
        </a>
      )}

      {submission.liveDemoUrl && (
        <a
          href={submission.liveDemoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm text-emerald hover:underline"
        >
          View Live Demo
        </a>
      )}

      {submission.notes && (
        <div>
          <p className="text-xs text-text-secondary mb-1">Student Notes</p>
          <p className="text-sm text-text-primary">
            {submission.notes}
          </p>
        </div>
      )}

      {submission.attachments?.length > 0 && (
        <div>
          <p className="text-xs text-text-secondary mb-2">Attachments</p>

          <div className="space-y-1">
            {submission.attachments.map((file, index) => (
              <a
                key={file.url || index}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gold hover:underline"
              >
                {file.filename}
              </a>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-danger text-sm">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-text-secondary mb-1">
            Score
          </label>

          <input
            type="number"
            min="0"
            max={maxScore}
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
            className="w-full p-2 rounded border border-border bg-background text-text-primary"
          />
        </div>

        <div>
          <label className="block text-xs text-text-secondary mb-1">
            Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 rounded border border-border bg-background text-text-primary"
          >
            <option value="Graded">Graded</option>
            <option value="Resubmission Requested">
              Resubmission Requested
            </option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-text-secondary mb-1">
          Feedback
        </label>

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write feedback for the student..."
          rows={4}
          className="w-full p-2 rounded border border-border bg-background text-text-primary"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-50"
      >
        {loading ? "Saving..." : "Submit Grade"}
      </button>
    </form>
  );
}