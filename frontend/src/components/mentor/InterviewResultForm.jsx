import { useEffect, useState } from "react";
import { getInterviewQuestions } from "../../api/interviewQuestion.api";
import { submitInterviewResult } from "../../api/application.api";

export default function InterviewResultForm({ applicant, onSubmitted }) {
  const [questions, setQuestions] = useState([]);
  const [scores, setScores] = useState({});
  const [note, setNote] = useState("");

  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getInterviewQuestions()
      .then((res) => setQuestions(res.data.data))
      .catch(() => setError("Failed to load interview questions"))
      .finally(() => setLoadingQuestions(false));
  }, []);

  const handleScoreChange = (questionId, value) => {
    setScores({ ...scores, [questionId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!note.trim()) {
      setError("Please add a note explaining the scores.");
      return;
    }

    const answers = [];
    for (const q of questions) {
      const raw = scores[q._id];
      if (raw === undefined || raw === "") {
        setError(`Please score: "${q.text}"`);
        return;
      }
      const value = Number(raw);
      if (value < 0 || value > q.maxScore) {
        setError(`Score for "${q.text}" must be between 0 and ${q.maxScore}.`);
        return;
      }
      answers.push({ questionId: q._id, score: value });
    }

    setSubmitting(true);
    try {
      const res = await submitInterviewResult(applicant._id, { answers, note });
      setSuccess(res.data.message || "Interview result submitted.");
      onSubmitted?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit interview result.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingQuestions) {
    return (
      <p className="text-text-secondary text-sm border-t border-border/50 pt-4">
        Loading interview questions…
      </p>
    );
  }

  if (questions.length === 0) {
    return (
      <p className="text-danger text-sm border-t border-border/50 pt-4">
        No interview questions have been configured yet. Ask an admin to add
        some before conducting interviews.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border/50 pt-4 space-y-4">
      {questions.map((q) => (
        <div key={q._id}>
          <label className="block text-sm text-text-primary mb-1">
            {q.text}
          </label>
          <input
            type="number"
            min="0"
            max={q.maxScore}
            value={scores[q._id] ?? ""}
            onChange={(e) => handleScoreChange(q._id, e.target.value)}
            placeholder={`0 - ${q.maxScore}`}
            className="w-32 p-2 rounded border border-border bg-background text-text-primary text-sm"
          />
          <span className="text-xs text-text-secondary ml-2">
            / {q.maxScore}
          </span>
        </div>
      ))}

      <div>
        <label className="block text-sm text-text-primary mb-1">
          Note — why these scores?
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full p-2 rounded border border-border bg-background text-text-primary text-sm resize-none"
        />
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}
      {success && <p className="text-emerald text-sm">{success}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Interview Result"}
      </button>
    </form>
  );
}
