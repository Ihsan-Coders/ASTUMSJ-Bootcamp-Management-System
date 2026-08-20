import { useState } from 'react';
import { gradeSubmission } from '../../api/submission.api';

export default function GradingPanel({ submission, onGraded }) {
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const handleGrade = async (status) => {
    setError('');
    try {
      await gradeSubmission(submission._id, { score: Number(score), feedback, status });
      onGraded?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Grading failed');
    }
  };

  return (
    <div className="glass-card glow-border rounded-lg p-6 space-y-3">
      <p className="text-text-primary">{submission.student?.name}</p>
      <a href={submission.githubUrl} target="_blank" rel="noreferrer" className="text-gold text-sm hover:underline">
        View GitHub →
      </a>
      {error && <p className="text-danger text-sm">{error}</p>}
      <input type="number" placeholder="Score" value={score} onChange={(e) => setScore(e.target.value)}
        className="w-full p-2 rounded border border-border bg-background text-text-primary" />
      <textarea placeholder="Feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)}
        className="w-full p-2 rounded border border-border bg-background text-text-primary" />
      <div className="flex gap-2">
        <button onClick={() => handleGrade('Graded')} className="flex-1 py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald">
          Submit Grade
        </button>
        <button onClick={() => handleGrade('Resubmission Requested')} className="flex-1 py-2 rounded border border-warning text-warning">
          Request Resubmission
        </button>
      </div>
    </div>
  );
}
