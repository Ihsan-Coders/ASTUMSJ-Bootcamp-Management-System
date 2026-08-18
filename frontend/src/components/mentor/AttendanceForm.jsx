import { useState } from 'react';
import { markAttendance } from '../../api/attendance.api';
import { motion } from 'framer-motion';

export default function AttendanceForm({ studentId, batchId, onMarked }) {
  const [status, setStatus] = useState('Present');
  const [loading, setLoading] = useState(false);

  // Submits the selected attendance status for this student/batch
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await markAttendance({
        student: studentId,
        batch: batchId,
        date: new Date(),
        status,
      });
      onMarked?.(); // notify parent that attendance was marked
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card glow-border rounded-xl p-4 flex items-center gap-3"
    >
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="
          px-3 py-2
          rounded-lg
          border border-border
          bg-surface-solid
          text-text-primary
          outline-none
          focus:border-gold
          focus:ring-1
          focus:ring-gold/40
        "
      >
        {['Present', 'Absent', 'Late', 'Excused'].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading}
        className="
          px-4 py-2
          rounded-lg
          text-sm
          font-semibold
          text-obsidian
          bg-gradient-to-r
          from-gold
          to-emerald
          hover:shadow-[0_0_20px_rgba(212,175,55,0.35)]
          transition-shadow
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {loading ? 'Marking...' : 'Mark'}
      </button>
    </motion.form>
  );
}