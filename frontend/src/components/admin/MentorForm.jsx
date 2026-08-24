import { useState } from 'react';
import { createMentor } from '../../api/user.api';

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
};

export default function MentorForm({ onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await createMentor(form);

      setForm(EMPTY_FORM);
      onCreated?.();
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to create mentor'
      );
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
        Create Mentor
      </h3>

      <p className="text-xs text-text-secondary -mt-2">
        Create a new mentor account directly. The mentor role is assigned automatically.
      </p>

      <div>
        <label className="block text-xs text-text-secondary mb-1">
          Full Name
        </label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          minLength={2}
          className="w-full p-2 rounded border border-border bg-background text-text-primary"
        />
      </div>

      <div>
        <label className="block text-xs text-text-secondary mb-1">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 rounded border border-border bg-background text-text-primary"
        />
      </div>

      <div>
        <label className="block text-xs text-text-secondary mb-1">
          Temporary Password
        </label>

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={8}
          className="w-full p-2 rounded border border-border bg-background text-text-primary"
        />
      </div>

      {error && (
        <p className="text-danger text-sm">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
      >
        {submitting ? 'Creating…' : 'Create Mentor'}
      </button>
    </form>
  );
}