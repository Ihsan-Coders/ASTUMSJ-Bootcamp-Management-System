import { useState } from 'react';
import { createSubmission } from '../../api/submission.api';

export default function MyAssignments({ assignmentId, onSubmitted }) {
  const [form, setForm] = useState({ githubUrl: '', liveDemoUrl: '', notes: '' });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('assignment', assignmentId);
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      files.forEach((f) => formData.append('attachments', f));
      await createSubmission(formData);
      onSubmitted?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card glow-border rounded-lg p-6 space-y-3">
      {error && <p className="text-danger text-sm">{error}</p>}
      <input placeholder="GitHub URL" value={form.githubUrl}
        onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
        className="w-full p-2 rounded border border-border bg-background text-text-primary" />
      <input placeholder="Live Demo URL (optional)" value={form.liveDemoUrl}
        onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })}
        className="w-full p-2 rounded border border-border bg-background text-text-primary" />
      <textarea placeholder="Notes" value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        className="w-full p-2 rounded border border-border bg-background text-text-primary" />
      <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))}
        className="w-full text-sm text-text-secondary file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-gold/20 file:text-gold" />
      <button type="submit" disabled={submitting}
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60">
        {submitting ? 'Submitting…' : 'Submit Assignment'}
      </button>
    </form>
  );
}
