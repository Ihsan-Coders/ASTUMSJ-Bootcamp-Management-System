import { useEffect, useState } from "react";
import { createContest } from "../../api/contest.api";
import { getBatches } from "../../api/batch.api";

export default function ContestForm({ onCreated }) {
  const [batches, setBatches] = useState([]);

  const [form, setForm] = useState({
    name: "",
    codeforcesContestId: "",
    contestUrl: "",
    batch: "",
    startTime: "",
    durationMinutes: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getBatches()
      .then((res) => setBatches(res.data.data))
      .catch(() => setError("Failed to load batches"));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await createContest({
        ...form,
        codeforcesContestId: Number(form.codeforcesContestId),
        durationMinutes: Number(form.durationMinutes),
      });

      setForm({
        name: "",
        codeforcesContestId: "",
        contestUrl: "",
        batch: "",
        startTime: "",
        durationMinutes: "",
      });

      onCreated?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create contest");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card glow-border rounded-xl p-6 space-y-3"
    >
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        Create Gym Contest
      </h3>

      {error && <p className="text-danger text-sm">{error}</p>}

      {/* Contest name */}
      <input
        name="name"
        placeholder="Contest name (e.g. Weekly CP Round 5)"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full p-2 rounded border border-border bg-background text-text-primary text-sm"
      />

      {/* Gym contest ID */}
      <input
        name="codeforcesContestId"
        type="number"
        placeholder="Gym contest ID"
        value={form.codeforcesContestId}
        onChange={handleChange}
        required
        className="w-full p-2 rounded border border-border bg-background text-text-primary text-sm"
      />

      {/* Gym invitation URL */}
      <div>
        <label className="block text-xs text-text-secondary mb-1">
          Gym Invitation / Contest Link
        </label>

        <input
          name="contestUrl"
          type="url"
          placeholder="https://codeforces.com/gym/..."
          value={form.contestUrl}
          onChange={handleChange}
          required
          className="w-full p-2 rounded border border-border bg-background text-text-primary text-sm"
        />

        <p className="text-xs text-text-secondary mt-1">
          Students will use this link to join the contest.
        </p>
      </div>

      {/* Batch */}
      <select
        name="batch"
        value={form.batch}
        onChange={handleChange}
        required
        className="w-full p-2 rounded border border-border bg-background text-text-primary text-sm"
      >
        <option value="" disabled>
          Select a batch
        </option>

        {batches.map((b) => (
          <option key={b._id} value={b._id}>
            {b.name}
          </option>
        ))}
      </select>

      {/* Start time */}
      <input
        name="startTime"
        type="datetime-local"
        value={form.startTime}
        onChange={handleChange}
        required
        className="w-full p-2 rounded border border-border bg-background text-text-primary text-sm"
      />

      {/* Duration */}
      <input
        name="durationMinutes"
        type="number"
        min="1"
        placeholder="Duration (minutes)"
        value={form.durationMinutes}
        onChange={handleChange}
        required
        className="w-full p-2 rounded border border-border bg-background text-text-primary text-sm"
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
      >
        {submitting ? "Creating..." : "Create Gym Contest"}
      </button>
    </form>
  );
}
