import { useState } from "react";
import { submitInterviewResult } from "../../api/application.api";

export default function InterviewResultForm({ applicant, onSubmitted }) {
  const [score, setScore] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (recommendation) => {
    setError("");
    setSuccess("");

    if (score === "") {
      setError("Please enter an interview score first.");
      return;
    }
    if (Number(score) < 0 || Number(score) > 100) {
      setError("Score must be between 0 and 100.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitInterviewResult(applicant._id, {
        score: Number(score),
        recommendation,
      });
      setSuccess(res.data.message || "Interview result submitted.");
      onSubmitted?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit interview result.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-border/50 pt-4 space-y-3">
      <div>
        <label className="block text-xs text-text-secondary mb-1">
          Interview score (0-100)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="0 - 100"
          className="w-full sm:w-40 p-2 rounded border border-border bg-background text-text-primary"
        />
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}
      {success && <p className="text-emerald text-sm">{success}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleSubmit("pass")}
          className="flex-1 py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Recommend Pass"}
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleSubmit("fail")}
          className="flex-1 py-2 rounded border border-danger text-danger disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Recommend Fail"}
        </button>
      </div>
    </div>
  );
}
