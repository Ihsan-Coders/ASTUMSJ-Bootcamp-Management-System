import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, ClipboardCheck, AlertTriangle, Clock } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import { getMentorDashboard } from "../../api/dashboard.api";

const STATUSES = ["Present", "Absent", "Late", "Excused"];
const STATUS_COLOR = {
  Present: "bg-emerald/15 text-emerald",
  Absent: "bg-danger/15 text-danger",
  Late: "bg-warning/15 text-warning",
  Excused: "bg-text-secondary/15 text-text-secondary",
};

const FALLBACK_STUDENTS = [
  {
    id: 1,
    name: "Bethelhem Assefa",
    progress: 78,
    status: "Present",
    atRisk: false,
  },
  { id: 2, name: "Dawit Alemu", progress: 42, status: "Absent", atRisk: true },
  {
    id: 3,
    name: "Selam Tesfaye",
    progress: 88,
    status: "Present",
    atRisk: false,
  },
  { id: 4, name: "Yonas Kebede", progress: 35, status: "Late", atRisk: true },
];

const FALLBACK_GRADING_QUEUE = [
  {
    id: 1,
    student: "Bethelhem Assefa",
    assignment: "React Todo App",
    submitted: "2 days ago",
  },
  {
    id: 2,
    student: "Selam Tesfaye",
    assignment: "Express REST API",
    submitted: "5 hours ago",
  },
];

export default function MentorDashboard() {
  const [students, setStudents] = useState(FALLBACK_STUDENTS);
  const [gradingQueue, setGradingQueue] = useState(FALLBACK_GRADING_QUEUE);
  const [pendingGradingCount, setPendingGradingCount] = useState(
    FALLBACK_GRADING_QUEUE.length,
  );
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    getMentorDashboard()
      .then((res) => {
        const data = res.data.data;
        if (data.studentStats) {
          setStudents(
            data.studentStats.map((s, i) => ({
              id: s.student.id || i,
              name: s.student.name,
              progress: s.completedTopics,
              status: "Present", // real per-day status shown once attendance UI is wired
              atRisk: s.isAtRisk,
            })),
          );
        }
        setPendingGradingCount(
          data.pendingGradingCount ?? FALLBACK_GRADING_QUEUE.length,
        );
        setIsLive(true);
      })
      .catch(() => setIsLive(false));
  }, []);

  const setStatus = (id, status) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );
  };

  const atRiskCount = students.filter((s) => s.atRisk).length;
  const avgProgress =
    students.length > 0
      ? Math.round(
          students.reduce((a, s) => a + s.progress, 0) / students.length,
        )
      : 0;

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)]"
        >
          Mentor Dashboard
        </motion.h1>
        {!isLive && (
          <span className="text-xs px-2 py-1 rounded-full bg-warning/15 text-warning">
            Sample Data
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Assigned Students"
          value={students.length}
          icon={Users}
        />
        <StatCard
          label="Pending Grading"
          value={pendingGradingCount}
          icon={ClipboardCheck}
        />
        <StatCard
          label="At-Risk Students"
          value={atRiskCount}
          icon={AlertTriangle}
        />
        <StatCard
          label="Avg. Progress"
          value={`${avgProgress}%`}
          icon={Clock}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card glow-border rounded-xl p-5">
          <h2 className="text-text-primary font-semibold mb-4">
            Assigned Students
          </h2>
          <div className="space-y-3">
            {students.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between border-b border-border/50 last:border-0 pb-3 last:pb-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <p className="text-text-primary text-sm font-medium truncate">
                    {s.name}
                  </p>
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
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card glow-border rounded-xl p-5">
          <h2 className="text-text-primary font-semibold mb-4">
            Pending Grading Queue
          </h2>
          <div className="space-y-3">
            {gradingQueue.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between border-b border-border/50 last:border-0 pb-3 last:pb-0"
              >
                <div>
                  <p className="text-text-primary text-sm font-medium">
                    {g.assignment}
                  </p>
                  <p className="text-text-secondary text-xs">
                    {g.student} · submitted {g.submitted}
                  </p>
                </div>
                <button className="text-xs px-3 py-1.5 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald shrink-0">
                  Review
                </button>
              </div>
            ))}
            {gradingQueue.length === 0 && (
              <p className="text-text-secondary text-sm">
                Nothing pending — you're all caught up.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
