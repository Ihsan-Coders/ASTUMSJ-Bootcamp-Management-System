import { useState } from 'react';
import { createAdmin } from '../../api/user.api';

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
};

// Mirrors MentorForm.jsx exactly. The backend (createAdmin in
// user.controller.js) hardcodes role:'admin' server-side and this route
// is only reachable by an already-authenticated admin (authorize('admin')
// in user.routes.js) — this form has no special client-side "security" of
// its own to add; it's just the missing UI for an endpoint that was
// already secured on the backend.
export default function AdminForm({ onCreated }) {
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
      await createAdmin(form);

      setForm(EMPTY_FORM);
      onCreated?.();
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to create admin'
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
        Create Admin
      </h3>

      <p className="text-xs text-text-secondary -mt-2">
        Grants full admin access. Only use this for people who should have
        complete control over the system.
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
        <p className="text-xs text-text-secondary mt-1">
          At least 8 characters, with uppercase, lowercase, a number, and a special character.
        </p>
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
        {submitting ? 'Creating…' : 'Create Admin'}
      </button>
    </form>
  );
}
