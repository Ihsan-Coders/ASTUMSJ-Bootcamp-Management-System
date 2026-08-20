import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAssignments } from '../../api/assignment.api';
import { getSubmissions } from '../../api/submission.api';
import AssignmentForm from '../../components/mentor/AssignmentForm';
import GradingPanel from '../../components/mentor/GradingPanel';

export default function AssignmentsPage({ batchId }) {
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const loadAssignments = () => {
    getAssignments({ batchId }).then((res) => setAssignments(res.data.data));
  };

  useEffect(() => { loadAssignments(); }, [batchId]);

  const openAssignment = (assignment) => {
    setSelected(assignment);
    getSubmissions({ assignmentId: assignment._id }).then((res) => setSubmissions(res.data.data));
  };

  const refreshSubmissions = () => {
    if (selected) openAssignment(selected);
  };

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-text-primary">
          Assignments
        </motion.h1>
        <button onClick={() => setShowForm((v) => !v)}
          className="text-sm px-4 py-2 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald">
          {showForm ? 'Close' : 'New Assignment'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <AssignmentForm batchId={batchId} onCreated={() => { setShowForm(false); loadAssignments(); }} />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card glow-border rounded-xl p-5">
          <h2 className="text-text-primary font-semibold mb-4">All Assignments</h2>
          <div className="space-y-2">
            {assignments.map((a) => (
              <button key={a._id} onClick={() => openAssignment(a)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selected?._id === a._id ? 'border-gold bg-gold/10' : 'border-border hover:border-gold/40'
                }`}>
                <p className="text-text-primary text-sm font-medium">{a.title}</p>
                <p className="text-text-secondary text-xs mt-0.5">
                  Due {new Date(a.deadline).toLocaleDateString()} · Max {a.maxScore}
                </p>
              </button>
            ))}
            {assignments.length === 0 && (
              <p className="text-text-secondary text-sm">No assignments yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {!selected && (
            <div className="glass-card glow-border rounded-xl p-5 text-text-secondary text-sm">
              Select an assignment to review submissions.
            </div>
          )}
          {selected && submissions.length === 0 && (
            <div className="glass-card glow-border rounded-xl p-5 text-text-secondary text-sm">
              No submissions yet for "{selected.title}".
            </div>
          )}
          {selected && submissions.map((s) => (
            <GradingPanel key={s._id} submission={s} onGraded={refreshSubmissions} />
          ))}
        </div>
      </div>
    </div>
  );
}
