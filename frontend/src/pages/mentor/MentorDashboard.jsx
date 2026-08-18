import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ClipboardCheck, AlertTriangle, Clock } from 'lucide-react';
import StatCard from '../../components/common/StatCard';

const STATUSES = ['Present', 'Absent', 'Late', 'Excused'];
const STATUS_COLOR = {
  Present: 'bg-emerald/15 text-emerald',
  Absent: 'bg-danger/15 text-danger',
  Late: 'bg-warning/15 text-warning',
  Excused: 'bg-text-secondary/15 text-text-secondary',
};

const INITIAL_STUDENTS = [
  { id: 1, name: 'Bethelhem Assefa', progress: 78, status: 'Present', atRisk: false },
  { id: 2, name: 'Dawit Alemu', progress: 42, status: 'Absent', atRisk: true },
  { id: 3, name: 'Selam Tesfaye', progress: 88, status: 'Present', atRisk: false },
  { id: 4, name: 'Yonas Kebede', progress: 35, status: 'Late', atRisk: true },
];

const GRADING_QUEUE = [
  { id: 1, student: 'Bethelhem Assefa', assignment: 'React Todo App', submitted: '2 days ago' },
  { id: 2, student: 'Selam Tesfaye', assignment: 'Express REST API', submitted: '5 hours ago' },
];

export default function MentorDashboard() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  const setStatus = (id, status) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const atRiskCount = students.filter((s) => s.atRisk).length;

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)] mb-6"
      >
        Mentor Dashboard
      </motion.h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Assigned Students" value={students.length} icon={Users} />
        <StatCard label="Pending Grading" value={GRADING_QUEUE.length} icon={ClipboardCheck} />
        <StatCard label="At-Risk Students" value={atRiskCount} icon={AlertTriangle} />
        <StatCard label="Avg. Progress" value={`${Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length)}%`} icon={Clock} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card glow-border rounded-xl p-5">
          <h2 className="text-text-primary font-semibold mb-4">Assigned Students</h2>
          <div className="space-y-3">
            {students.map((s) => (
              <div key={s.id} className="flex items-center justify-between border-b border-border/50 last:border-0 pb-3 last:pb-0">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="text-text-primary text-sm font-medium truncate">{s.name}</p>
                  {s.atRisk && (
                    <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-danger/15 text-danger flex items-center gap-1">
                      <AlertTriangle size={10} /> At risk
                    </span>
                  )}
                </div>
                <select
                  value={s.status}
                  onChange={(e) => setStatus(s.id, e.target.value)}
                  className={`text-xs rounded-full px-2.5 py-1 border-0 shrink-0 ${STATUS_COLOR[s.status]}`}
                >
                  {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card glow-border rounded-xl p-5">
          <h2 className="text-text-primary font-semibold mb-4">Pending Grading Queue</h2>
          <div className="space-y-3">
            {GRADING_QUEUE.map((g) => (
              <div key={g.id} className="flex items-center justify-between border-b border-border/50 last:border-0 pb-3 last:pb-0">
                <div>
                  <p className="text-text-primary text-sm font-medium">{g.assignment}</p>
                  <p className="text-text-secondary text-xs">{g.student} · submitted {g.submitted}</p>
                </div>
                <button className="text-xs px-3 py-1.5 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald shrink-0">
                  Review
                </button>
              </div>
            ))}
            {GRADING_QUEUE.length === 0 && (
              <p className="text-text-secondary text-sm">Nothing pending — you're all caught up.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
