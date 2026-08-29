import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ClipboardCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Code2,
} from "lucide-react";

import StatCard from "../../components/common/StatCard";
import { getMentorDashboard } from "../../api/dashboard.api";
import { getWeeklyDSAActivity } from "../../api/dsaProblem.api";

const STATUS_COLOR = {
  Present: "bg-emerald/15 text-emerald",
  Absent: "bg-danger/15 text-danger",
  Late: "bg-warning/15 text-warning",
  "No Records": "bg-text-secondary/15 text-text-secondary",
};

const getAttendanceStatus = (attendancePercentage) => {
  if (attendancePercentage >= 90) return "Present";
  if (attendancePercentage >= 75) return "Late";
  if (attendancePercentage > 0) return "Absent";
  return "No Records";
};

const formatSubmittedTime = (submittedAt) => {
  if (!submittedAt) return "Unknown";

  const date = new Date(submittedAt);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleString();
};

const getWeekDates = () => {
  const now = new Date();

  const day = now.getDay();

  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);
  nextMonday.setHours(0, 0, 0, 0);

  return {
    startDate: monday.toISOString(),
    endDate: nextMonday.toISOString(),
  };
};

export default function MentorDashboard() {
  const [students, setStudents] = useState([]);
  const [gradingQueue, setGradingQueue] = useState([]);
  const [pendingGradingCount, setPendingGradingCount] = useState(0);

  const [dsaActivity, setDsaActivity] = useState([]);
  const [dsaLoading, setDsaLoading] = useState(true);
  const [dsaError, setDsaError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMentorDashboard();
      const data = response?.data?.data;

      if (!data) {
        throw new Error("Invalid dashboard response.");
      }

      setStudents(
        Array.isArray(data.studentStats)
          ? data.studentStats.map((studentStat) => ({
              id: studentStat.student?.id,
              name: studentStat.student?.name || "Unknown Student",
              email: studentStat.student?.email || "",
              progress: studentStat.progressPercentage ?? 0,
              completedTopics: studentStat.completedTopics ?? 0,
              totalTopics: studentStat.totalTopics ?? 0,
              attendance: studentStat.attendancePercentage ?? 0,
              atRisk: Boolean(studentStat.isAtRisk),
              riskReasons: Array.isArray(studentStat.riskReasons)
                ? studentStat.riskReasons
                : [],
            }))
          : [],
      );

      setGradingQueue(
        Array.isArray(data.pendingGradingQueue) ? data.pendingGradingQueue : [],
      );

      setPendingGradingCount(data.pendingGradingCount ?? 0);
    } catch (err) {
      console.error("Failed to load mentor dashboard:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load mentor dashboard.",
      );

      setStudents([]);
      setGradingQueue([]);
      setPendingGradingCount(0);
    } finally {
      setLoading(false);
    }
  };

  const loadDSAActivity = async () => {
    try {
      setDsaLoading(true);
      setDsaError("");

      const { startDate, endDate } = getWeekDates();

      const response = await getWeeklyDSAActivity(startDate, endDate);

      const data = response?.data?.data;

      if (!data) {
        throw new Error("Invalid DSA activity response.");
      }

      const activityMap = new Map(
        Array.isArray(data.students)
          ? data.students.map((item) => [
              item.student?.id?.toString(),
              Number(item.problemCount || 0),
            ])
          : [],
      );

      const activity = students.map((student) => ({
        ...student,
        problemsSolved: activityMap.get(student.id?.toString()) || 0,
      }));

      setDsaActivity(activity);
    } catch (err) {
      console.error("Failed to load DSA activity:", err);

      setDsaError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load DSA activity.",
      );

      setDsaActivity([]);
    } finally {
      setDsaLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!loading) {
      loadDSAActivity();
    }
  }, [loading, students]);

  const atRiskCount = students.filter((student) => student.atRisk).length;

  const avgProgress =
    students.length > 0
      ? Math.round(
          students.reduce((total, student) => total + student.progress, 0) /
            students.length,
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

        {!loading && !error && (
          <span className="text-xs px-2 py-1 rounded-full bg-emerald/15 text-emerald">
            Live Data
          </span>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-danger/30 bg-danger/10 p-4">
          <div className="flex items-start gap-3">
            <XCircle size={18} className="text-danger shrink-0 mt-0.5" />

            <div>
              <p className="text-danger font-semibold text-sm">
                Failed to load dashboard
              </p>

              <p className="text-text-secondary text-sm mt-1">{error}</p>

              <button
                type="button"
                onClick={loadDashboard}
                className="mt-3 text-xs px-3 py-1.5 rounded-lg border border-danger/30 text-danger hover:bg-danger/10"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 rounded-xl bg-white/5 animate-pulse"
              />
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="h-80 rounded-xl bg-white/5 animate-pulse" />
            <div className="h-80 rounded-xl bg-white/5 animate-pulse" />
          </div>
        </div>
      ) : (
        <>
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-text-primary font-semibold">
                  Assigned Students
                </h2>

                <span className="text-xs text-text-secondary">
                  {students.length} student
                  {students.length !== 1 ? "s" : ""}
                </span>
              </div>

              {students.length === 0 ? (
                <div className="py-10 text-center">
                  <Users
                    size={32}
                    className="mx-auto text-text-secondary mb-3"
                  />

                  <p className="text-text-primary text-sm font-medium">
                    No students assigned
                  </p>

                  <p className="text-text-secondary text-xs mt-1">
                    Students assigned to your batches will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {students.map((student) => {
                    const attendanceStatus = getAttendanceStatus(
                      student.attendance,
                    );

                    return (
                      <div
                        key={student.id}
                        className="border-b border-border/50 last:border-0 pb-3 last:pb-0"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-text-primary text-sm font-medium truncate">
                                {student.name}
                              </p>

                              {student.atRisk && (
                                <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-danger/15 text-danger flex items-center gap-1">
                                  <AlertTriangle size={10} />
                                  At risk
                                </span>
                              )}
                            </div>

                            {student.email && (
                              <p className="text-text-secondary text-xs mt-1 truncate">
                                {student.email}
                              </p>
                            )}
                          </div>

                          <span
                            className={`text-xs rounded-full px-2.5 py-1 shrink-0 ${
                              STATUS_COLOR[attendanceStatus] ||
                              STATUS_COLOR["No Records"]
                            }`}
                          >
                            {student.attendance}% attendance
                          </span>
                        </div>

                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-text-secondary">
                              Progress
                            </span>

                            <span className="text-text-primary">
                              {student.progress}%
                            </span>
                          </div>

                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-gold to-emerald transition-all"
                              style={{
                                width: `${Math.min(
                                  Math.max(student.progress, 0),
                                  100,
                                )}%`,
                              }}
                            />
                          </div>

                          <p className="text-[11px] text-text-secondary mt-1">
                            {student.completedTopics} of {student.totalTopics}{" "}
                            topics completed
                          </p>
                        </div>

                        {student.atRisk && student.riskReasons.length > 0 && (
                          <div className="mt-2">
                            <p className="text-[11px] text-danger">
                              {student.riskReasons.join(" • ")}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="glass-card glow-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-text-primary font-semibold">
                  Pending Grading Queue
                </h2>

                <span className="text-xs px-2 py-1 rounded-full bg-warning/15 text-warning">
                  {pendingGradingCount} pending
                </span>
              </div>

              {gradingQueue.length === 0 ? (
                <div className="py-10 text-center">
                  <CheckCircle2
                    size={32}
                    className="mx-auto text-emerald mb-3"
                  />

                  <p className="text-text-primary text-sm font-medium">
                    Nothing pending
                  </p>

                  <p className="text-text-secondary text-xs mt-1">
                    You're all caught up.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {gradingQueue.map((submission) => (
                    <div
                      key={submission._id}
                      className="flex items-center justify-between gap-3 border-b border-border/50 last:border-0 pb-3 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="text-text-primary text-sm font-medium truncate">
                          {submission.assignment?.title || "Assignment"}
                        </p>

                        <p className="text-text-secondary text-xs mt-1">
                          {submission.student?.name || "Student"}
                        </p>

                        <p className="text-text-secondary text-[11px] mt-1">
                          Submitted{" "}
                          {formatSubmittedTime(
                            submission.submittedAt || submission.createdAt,
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald shrink-0"
                        onClick={() =>
                          console.log("Review submission:", submission._id)
                        }
                      >
                        Review
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="glass-card glow-border rounded-xl p-5 mt-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Code2 size={20} className="text-gold" />

                  <h2 className="text-text-primary font-semibold">
                    Weekly DSA Activity
                  </h2>
                </div>

                <p className="text-text-secondary text-xs mt-1">
                  Track how many unique problems your students solved this week.
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-text-secondary">Weekly target:</p>

                <p className="text-sm font-bold text-gold">10 problems</p>
              </div>
            </div>

            {dsaError && (
              <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
                {dsaError}
              </div>
            )}

            {dsaLoading ? (
              <div className="space-y-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="h-20 rounded-xl bg-white/5 animate-pulse"
                  />
                ))}
              </div>
            ) : dsaActivity.length === 0 ? (
              <div className="py-10 text-center">
                <Code2 size={32} className="mx-auto text-text-secondary mb-3" />

                <p className="text-text-primary text-sm font-medium">
                  No DSA activity yet
                </p>

                <p className="text-text-secondary text-xs mt-1">
                  Your students' weekly problem-solving activity will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {dsaActivity.map((student) => {
                  const solved = student.problemsSolved || 0;
                  const target = 10;
                  const percentage = Math.min(
                    Math.round((solved / target) * 100),
                    100,
                  );

                  return (
                    <div
                      key={student.id}
                      className="rounded-xl border border-border/50 bg-white/[0.02] p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-text-primary text-sm font-medium truncate">
                            {student.name}
                          </p>

                          <p className="text-text-secondary text-xs mt-1 truncate">
                            {student.email}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-text-primary">
                            {solved} / {target}
                          </p>

                          <p className="text-xs text-gold">{percentage}%</p>
                        </div>
                      </div>

                      <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold to-emerald transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
