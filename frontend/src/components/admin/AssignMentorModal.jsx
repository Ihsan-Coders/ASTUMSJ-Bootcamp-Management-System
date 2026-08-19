import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { getUsers } from '../../api/user.api';
import { getBatches, assignMentor } from '../../api/batch.api';

export default function AssignMentorModal({ isOpen, onClose, onAssigned }) {
  const [mentors, setMentors] = useState([]);
  const [batches, setBatches] = useState([]);
  const [mentorId, setMentorId] = useState('');
  const [batchId, setBatchId] = useState('');
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    Promise.all([getUsers({ role: 'mentor' }), getBatches()])
      .then(([mentorsRes, batchesRes]) => {
        if (cancelled) return;
        setMentors(mentorsRes.data.data);
        setBatches(batchesRes.data.data);
        setError('');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.message || 'Failed to load options');
      })
      .finally(() => {
        if (!cancelled) setLoadingOptions(false);
      });
    return () => { cancelled = true; };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mentorId || !batchId) {
      setError('Choose both a mentor and a batch');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await assignMentor({ batchId, mentorId });
      setMentorId('');
      setBatchId('');
      onAssigned?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to assign mentor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Mentor to Batch"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-sm text-text-secondary hover:text-text-primary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || loadingOptions}
            className="px-4 py-2 rounded text-sm font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
          >
            {submitting ? 'Assigning…' : 'Assign'}
          </button>
        </>
      }
    >
      {loadingOptions ? (
        <p className="text-text-secondary text-sm">Loading mentors and batches…</p>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-text-secondary mb-1">Mentor</label>
            <select
              value={mentorId}
              onChange={(e) => setMentorId(e.target.value)}
              className="w-full p-2 rounded border border-border bg-background text-text-primary"
            >
              <option value="" disabled>Select a mentor</option>
              {mentors.map((m) => (
                <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
              ))}
            </select>
            {mentors.length === 0 && (
              <p className="text-xs text-text-secondary mt-1">No mentor accounts exist yet.</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1">Batch</label>
            <select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="w-full p-2 rounded border border-border bg-background text-text-primary"
            >
              <option value="" disabled>Select a batch</option>
              {batches.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}
        </div>
      )}
    </Modal>
  );
}
