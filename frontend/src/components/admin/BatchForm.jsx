import { useState } from 'react';
import { createBatch } from '../../api/batch.api';

const FIELDS = [
  { name: 'name', label: 'Batch Name', type: 'text' },
  { name: 'startDate', label: 'Start Date', type: 'date' },
  { name: 'endDate', label: 'End Date', type: 'date' },
  { name: 'registrationStart', label: 'Registration Opens', type: 'date' },
  { name: 'registrationEnd', label: 'Registration Closes', type: 'date' },
];

const EMPTY_FORM = {
  name: '', startDate: '', endDate: '', registrationStart: '', registrationEnd: '',
};

export default function BatchForm({ onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await createBatch(form);
      setForm(EMPTY_FORM);
      onCreated?.();
    } catch (err) {
      // Backend enforces endDate > startDate and registrationEnd > registrationStart
      // (batch.validator.js) — surface that message instead of failing silently.
      setError(err?.response?.data?.message || 'Failed to create batch');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card glow-border rounded-lg p-6 space-y-3">
      <h3 className="text-lg font-semibold text-text-primary">Create Batch</h3>

      {FIELDS.map(({ name, label, type }) => (
        <div key={name}>
          <label className="block text-xs text-text-secondary mb-1">{label}</label>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            required
            className="w-full p-2 rounded border border-border bg-background text-text-primary"
          />
        </div>
      ))}

      {error && <p className="text-danger text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
      >
        {submitting ? 'Creating…' : 'Create Batch'}
      </button>
    </form>
  );
}
