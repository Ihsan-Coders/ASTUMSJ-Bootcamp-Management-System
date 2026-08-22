import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  ClipboardCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react";
import StatCard from "../../components/common/StatCard";
import { getMentorDashboard } from "../../api/dashboard.api";

const FALLBACK_STUDENTS = [
  { id: 1, name: "Bethelhem Assefa", attendancePercentage: 94, atRisk: false },
  { id: 2, name: "Dawit Alemu", attendancePercentage: 42, atRisk: true },
  { id: 3, name: "Selam Tesfaye", attendancePercentage: 88, atRisk: false },
  { id: 4, name: "Yonas Kebede", attendancePercentage: 35, atRisk: true },
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

  if (attendancePercentage >= 75) {
    return "Late";
  }

  if (attendancePercentage > 0) {
    return "Absent";
  }

  return "No Records";
};

/**
 * Format submission date
 */
const formatSubmittedTime = (
  submittedAt,
) => {
  if (!submittedAt) {
    return "Unknown";
  }

  const date = new Date(
    submittedAt,
  );

  useEffect(() => {
    getMentorDashboard()
      .then((res) => {
        const data = res.data.data;
        if (data.studentStats) {
          setStudents(
            data.studentStats.map((s, i) => ({
              id: s.student.id || i,
              name: s.student.name,
              attendancePercentage: s.attendancePercentage,
              atRisk: s.isAtRisk,
            })),
          );
        }
        setPendingGradingCount(
          data.pendingGradingCount ?? FALLBACK_GRADING_QUEUE.length,
        );
      }

  const atRiskCount = students.filter((s) => s.atRisk).length;
  const avgAttendance =
    students.length > 0
      ? Math.round(
          students.reduce((a, s) => a + s.attendancePercentage, 0) /
            students.length,
        )
      : 0;

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      {/* =========================
          HEADER
      ========================= */}
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
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
          label="Avg. Attendance"
          value={`${avgAttendance}%`}
          icon={Clock}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card glow-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-text-primary font-semibold">
              Assigned Students
            </h2>
            <Link
              to="/mentor/attendance"
              className="text-xs text-gold hover:underline flex items-center gap-1"
            >
              Mark Attendance <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {students.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between border-b border-border/50 last:border-0 pb-3 last:pb-0"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          LOADING
      ========================= */}
      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-28 rounded-xl bg-white/5 animate-pulse"
                />
              ),
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="h-80 rounded-xl bg-white/5 animate-pulse" />
            <div className="h-80 rounded-xl bg-white/5 animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          {/* =========================
              STATISTICS
          ========================= */}
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

          {/* =========================
              MAIN CONTENT
          ========================= */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* =========================
                ASSIGNED STUDENTS
            ========================= */}
            <div className="glass-card glow-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-text-primary font-semibold">
                  Assigned Students
                </h2>

                <span className="text-xs text-text-secondary">
                  {students.length} student
                  {students.length !==
                  1
                    ? "s"
                    : ""}
                </span>
              </div>

              {students.length ===
              0 ? (
                <div className="py-10 text-center">
                  <Users
                    size={32}
                    className="mx-auto text-text-secondary mb-3"
                  />

                  <p className="text-text-primary text-sm font-medium">
                    No students assigned
                  </p>

                  <p className="text-text-secondary text-xs mt-1">
                    Students assigned to
                    your batches will
                    appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {students.map(
                    (student) => {
                      const attendanceStatus =
                        getAttendanceStatus(
                          student.attendance,
                        );

                      return (
                        <div
                          key={
                            student.id
                          }
                          className="border-b border-border/50 last:border-0 pb-3 last:pb-0"
                        >
                          <div className="flex items-start justify-between gap-3">
                            {/* Student */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-text-primary text-sm font-medium truncate">
                                  {
                                    student.name
                                  }
                                </p>

                                {student.atRisk && (
                                  <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-danger/15 text-danger flex items-center gap-1">
                                    <AlertTriangle
                                      size={
                                        10
                                      }
                                    />

                                    At risk
                                  </span>
                                )}
                              </div>

                              {student.email && (
                                <p className="text-text-secondary text-xs mt-1 truncate">
                                  {
                                    student.email
                                  }
                                </p>
                              )}
                            </div>

                            {/* Attendance */}
                            <span
                              className={`text-xs rounded-full px-2.5 py-1 shrink-0 ${
                                STATUS_COLOR[
                                  attendanceStatus
                                ] ||
                                STATUS_COLOR[
                                  "No Records"
                                ]
                              }`}
                            >
                              {
                                student.attendance
                              }
                              % attendance
                            </span>
                          </div>

                          {/* Progress */}
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-text-secondary">
                                Progress
                              </span>

                              <span className="text-text-primary">
                                {
                                  student.progress
                                }
                                %
                              </span>
                            </div>

                            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-gold to-emerald transition-all"
                                style={{
                                  width: `${Math.min(
                                    Math.max(
                                      student.progress,
                                      0,
                                    ),
                                    100,
                                  )}%`,
                                }}
                              />
                            </div>

                            <p className="text-[11px] text-text-secondary mt-1">
                              {
                                student.completedTopics
                              }{" "}
                              of{" "}
                              {
                                student.totalTopics
                              }{" "}
                              topics completed
                            </p>
                          </div>

                          {/* Risk reasons */}
                          {student.atRisk &&
                            student
                              .riskReasons
                              .length >
                              0 && (
                              <div className="mt-2">
                                <p className="text-[11px] text-danger">
                                  {
                                    student.riskReasons.join(
                                      " • ",
                                    )
                                  }
                                </p>
                              </div>
                            )}
                        </div>
                      );
                    },
                  )}
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full shrink-0 ${
                    s.attendancePercentage >= 75
                      ? "bg-emerald/15 text-emerald"
                      : "bg-danger/15 text-danger"
                  }`}
                >
                  {s.attendancePercentage}% attendance
                </span>
              </div>

              {gradingQueue.length ===
              0 ? (
                <div className="py-10 text-center">
                  <CheckCircle2
                    size={32}
                    className="mx-auto text-emerald mb-3"
                  />

                  <p className="text-text-primary text-sm font-medium">
                    Nothing pending
                  </p>

                  <p className="text-text-secondary text-xs mt-1">
                    You're all caught
                    up.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {gradingQueue.map(
                    (submission) => (
                      <div
                        key={
                          submission._id
                        }
                        className="flex items-center justify-between gap-3 border-b border-border/50 last:border-0 pb-3 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="text-text-primary text-sm font-medium truncate">
                            {
                              submission
                                .assignment
                                ?.title ||
                              "Assignment"
                            }
                          </p>

                          <p className="text-text-secondary text-xs mt-1">
                            {
                              submission
                                .student
                                ?.name ||
                              "Student"
                            }
                          </p>

                          <p className="text-text-secondary text-[11px] mt-1">
                            Submitted{" "}
                            {formatSubmittedTime(
                              submission.submittedAt ||
                                submission.createdAt,
                            )}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald shrink-0"
                          onClick={() => {
                            console.log(
                              "Review submission:",
                              submission._id,
                            );
                          }}
                        >
                          Review
                          <ExternalLink
                            size={12}
                          />
                        </button>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}