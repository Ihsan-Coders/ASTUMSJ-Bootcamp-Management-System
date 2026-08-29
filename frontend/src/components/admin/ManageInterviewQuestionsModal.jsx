import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { useConfirm } from "../../context/ConfirmContext";
import {
  getInterviewQuestions,
  createInterviewQuestion,
  updateInterviewQuestion,
  deleteInterviewQuestion,
} from "../../api/interviewQuestion.api";

const emptyForm = { text: "", maxScore: 10 };

export default function ManageInterviewQuestionsModal({ isOpen, onClose }) {
  const confirm = useConfirm();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestions = () => {
    setLoading(true);
    getInterviewQuestions()
      .then((res) => {
        setQuestions(res.data.data);
        setError("");
      })
      .catch((err) =>
        setError(err?.response?.data?.message || "Failed to load questions"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchQuestions();
    }
  }, [isOpen]);

  const startEdit = (question) => {
    setEditingId(question._id);
    setForm({ text: question.text, maxScore: question.maxScore });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (editingId) {
        await updateInterviewQuestion(editingId, {
          text: form.text,
          maxScore: Number(form.maxScore),
        });
      } else {
        await createInterviewQuestion({
          text: form.text,
          maxScore: Number(form.maxScore),
        });
      }
      cancelEdit();
      fetchQuestions();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save question");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (question) => {
    const ok = await confirm(`Delete this question?\n\n"${question.text}"`, {
      title: "Delete question",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    setError("");
    try {
      await deleteInterviewQuestion(question._id);
      fetchQuestions();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete question");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Interview Questions">
      <div className="space-y-4">
        <p className="text-xs text-text-secondary">
          This list is used for every interview automatically — mentors
          don't select questions per applicant.
        </p>

        {error && <p className="text-danger text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            placeholder="Question text"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            required
            rows={2}
            className="w-full p-2 rounded border border-border bg-background text-text-primary text-sm resize-none"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              placeholder="Max score"
              value={form.maxScore}
              onChange={(e) => setForm({ ...form, maxScore: e.target.value })}
              required
              className="w-28 p-2 rounded border border-border bg-background text-text-primary text-sm"
            />
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald text-sm disabled:opacity-60"
            >
              {editingId ? "Save Changes" : "Add Question"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-3 py-2 rounded text-sm text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {loading && (
            <p className="text-text-secondary text-sm">Loading…</p>
          )}
          {!loading && questions.length === 0 && (
            <p className="text-text-secondary text-sm">
              No interview questions yet.
            </p>
          )}
          {questions.map((q) => (
            <div
              key={q._id}
              className="flex items-start justify-between gap-2 border border-border rounded p-2"
            >
              <div className="min-w-0">
                <p className="text-sm text-text-primary">{q.text}</p>
                <p className="text-xs text-text-secondary">
                  Max score: {q.maxScore}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(q)}
                  className="text-gold hover:underline text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(q)}
                  className="text-danger hover:underline text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
