import { useState } from 'react';
import { createAssignment } from '../../api/assignment.api';

export default function AssignmentForm({ batchId, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    instructions: '',
    deadline: '',
    maxScore: 100,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await createAssignment({
        ...form,
        batch: batchId,
        maxScore: Number(form.maxScore),
      });

      setForm({
        title: '',
        description: '',
        instructions: '',
        deadline: '',
        maxScore: 100,
      });

      onCreated?.();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create assignment'
      );
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

      {error && (
        <p className="text-danger text-sm">
          {error}
        </p>
      )}

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
        placeholder="Instructions"
        value={form.instructions}
        onChange={handleChange}
        required
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
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald"
      >
        Create Assignment
      </button>
    </form>
  );
}