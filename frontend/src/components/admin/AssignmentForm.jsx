import { useEffect, useState } from "react";
import { createAssignment } from "../../api/assignment.api";
import { getBatches } from "../../api/batch.api";

const initialForm = {
  title: "",
  description: "",
  instructions: "",
  deadline: "",
  maxScore: 100,
  batch: "",
};

export default function AssignmentForm({ onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getBatches()
      .then((res) => setBatches(res.data.data))
      .catch(() => setError("Failed to load batches"))
      .finally(() => setLoadingBatches(false));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.batch) {
      setError("Choose a batch");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await createAssignment({ ...form, maxScore: Number(form.maxScore) });
      setForm(initialForm);
      onCreated?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create assignment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card glow-border rounded-lg p-6 space-y-3"
    >
      <h3 className="text-lg font-semibold text-text-primary">
        Create Assignment
      </h3>

      {error && <p className="text-danger text-sm">{error}</p>}

      <select
        name="batch"
        value={form.batch}
        onChange={handleChange}
        required
        disabled={loadingBatches}
        className="w-full p-2 rounded border border-border bg-background text-text-primary"
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

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        className="w-full p-2 rounded border border-border bg-background text-text-primary"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
        className="w-full p-2 rounded border border-border bg-background text-text-primary"
      />
      <textarea
        name="instructions"
        placeholder="Instructions (optional)"
        value={form.instructions}
        onChange={handleChange}
        className="w-full p-2 rounded border border-border bg-background text-text-primary"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          required
          className="w-full p-2 rounded border border-border bg-background text-text-primary"
        />
        <input
          type="number"
          name="maxScore"
          placeholder="Max Score"
          value={form.maxScore}
          onChange={handleChange}
          min="1"
          required
          className="w-full p-2 rounded border border-border bg-background text-text-primary"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
      >
        {submitting ? "Creating…" : "Create Assignment"}
      </button>
    </form>
  );
}
