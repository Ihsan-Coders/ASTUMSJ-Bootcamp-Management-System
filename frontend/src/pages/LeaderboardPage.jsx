import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Users,
  CalendarCheck,
  Code2,
  Trophy,
  ClipboardCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { getLeaderboard } from "../api/leaderboard.api";
import { useAuth } from "../context/AuthContext";

const formatPercentage = (value) => `${value ?? 0}%`;

export default function LeaderboardPage() {
  const { user } = useAuth();

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scoringInfo, setScoringInfo] = useState(null);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError("");

      const batchId =
        user?.batch?._id ||
        user?.batch?.id ||
        user?.batchId ||
        user?.batch ||
        null;

      const response = await getLeaderboard(batchId);

      /*
       * Backend response:
       *
       * {
       *   success: true,
       *   data: {
       *     leaderboard: [...],
       *     scoring: {...}
       *   },
       *   message: "Overall bootcamp leaderboard fetched"
       * }
       *
       * Axios response.data is therefore:
       *
       * {
       *   success: true,
       *   data: {
       *     leaderboard: [...],
       *     scoring: {...}
       *   },
       *   message: "..."
       * }
       *
       * So the actual leaderboard is:
       * response.data.data.leaderboard
       */

      const leaderboardData = response?.data?.data?.leaderboard;

      if (!Array.isArray(leaderboardData)) {
        throw new Error("Invalid leaderboard response.");
      }

      setLeaderboard(leaderboardData);
      setScoringInfo(response?.data?.data?.scoring || null);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load leaderboard. Please try again.",
      );

      setLeaderboard([]);
      setScoringInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadLeaderboard();
    }
  }, [user]);

  /*
   * ============================
   * LOADING STATE
   * ============================
   */

  if (loading) {
    return (
      <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-72 rounded-lg bg-white/5" />

          <div className="h-5 w-96 max-w-full rounded-lg bg-white/5" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-28 rounded-xl bg-white/5" />
            ))}
          </div>

          <div className="h-96 rounded-xl bg-white/5" />
        </div>
      </div>
    );
  }

  /*
   * ============================
   * PAGE
   * ============================
   */

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      {/* =========================
          HEADER
      ========================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-7 h-7 text-gold" />

            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)]">
              Overall Bootcamp Leaderboard
            </h1>
          </div>

          <p className="text-text-secondary text-sm sm:text-base">
            Track overall bootcamp performance across assignments, attendance,
            DSA activity, and competitive programming.
          </p>
        </motion.div>

        <button
          type="button"
          onClick={loadLeaderboard}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border text-text-secondary hover:text-gold hover:border-gold/30 transition-all disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* =========================
          ERROR
      ========================== */}

      {error && (
        <div className="glass-card glow-border rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-danger shrink-0 mt-0.5" />

            <div>
              <p className="text-danger font-semibold text-sm">
                Failed to load leaderboard
              </p>

              <p className="text-text-secondary text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!error && (
        <>
          {/* =========================
              SUMMARY CARDS
          ========================== */}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {/* Students */}

            <div className="glass-card glow-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <Users className="text-gold" size={20} />

                <span className="text-2xl font-bold text-text-primary">
                  {leaderboard.length}
                </span>
              </div>

              <p className="text-text-secondary text-xs mt-3">Students</p>
            </div>

            {/* Average Attendance */}

            <div className="glass-card glow-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <CalendarCheck className="text-emerald" size={20} />

                <span className="text-2xl font-bold text-text-primary">
                  {leaderboard.length > 0
                    ? Math.round(
                        leaderboard.reduce(
                          (sum, item) =>
                            sum + (item.attendance?.percentage || 0),
                          0,
                        ) / leaderboard.length,
                      )
                    : 0}
                  %
                </span>
              </div>

              <p className="text-text-secondary text-xs mt-3">
                Avg. Attendance
              </p>
            </div>

            {/* DSA Problems */}

            <div className="glass-card glow-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <Code2 className="text-gold" size={20} />

                <span className="text-2xl font-bold text-text-primary">
                  {leaderboard.reduce(
                    (sum, item) => sum + (item.dsa?.uniqueProblemsSolved || 0),
                    0,
                  )}
                </span>
              </div>

              <p className="text-text-secondary text-xs mt-3">DSA Problems</p>
            </div>

            {/* Contest Participations */}

            <div className="glass-card glow-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <Trophy className="text-emerald" size={20} />

                <span className="text-2xl font-bold text-text-primary">
                  {leaderboard.reduce(
                    (sum, item) => sum + (item.contests?.participated || 0),
                    0,
                  )}
                </span>
              </div>

              <p className="text-text-secondary text-xs mt-3">
                Contest Participations
              </p>
            </div>
          </div>

          {/* =========================
              SRS SCORING INFORMATION
          ========================== */}

          {scoringInfo && !scoringInfo.defined && (
            <div className="mb-6 rounded-xl border border-gold/20 bg-gold/5 p-4">
              <p className="text-gold text-sm font-semibold">
                Overall ranking formula not yet defined
              </p>

              <p className="text-text-secondary text-xs mt-1">
                Performance data is displayed from the existing systems. No
                artificial weighting is being applied.
              </p>
            </div>
          )}

          {/* =========================
              EMPTY STATE
          ========================== */}

          {leaderboard.length === 0 ? (
            <div className="glass-card glow-border rounded-xl p-10 text-center">
              <Users size={36} className="mx-auto text-text-secondary mb-3" />

              <p className="text-text-primary font-semibold">
                No students found
              </p>

              <p className="text-text-secondary text-sm mt-1">
                There is no leaderboard data available yet.
              </p>
            </div>
          ) : (
            /* =========================
               LEADERBOARD TABLE
            ========================== */

            <div className="glass-card glow-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary">
                        Rank
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary">
                        Student
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-semibold text-text-secondary">
                        Attendance
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-semibold text-text-secondary">
                        DSA
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-semibold text-text-secondary">
                        CP Contests
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-semibold text-text-secondary">
                        CP Points
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-semibold text-text-secondary">
                        CP Solved
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-semibold text-text-secondary">
                        Assignments
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaderboard.map((entry, index) => {
                      const student = entry.student || {};
                      const attendance = entry.attendance || {};
                      const dsa = entry.dsa || {};
                      const contests = entry.contests || {};
                      const assignment = entry.assignment || {};

                      return (
                        <motion.tr
                          key={student.id || index}
                          initial={{
                            opacity: 0,
                            x: -10,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            delay: index * 0.05,
                          }}
                          className="border-b border-border/30 last:border-0 hover:bg-white/5 transition-colors"
                        >
                          {/* Rank */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              {index < 3 ? (
                                <>
                                  <Crown size={17} className="text-gold" />

                                  <span className="text-text-secondary text-sm">
                                    #{index + 1}
                                  </span>
                                </>
                              ) : (
                                <span className="w-5 text-center text-text-secondary text-sm">
                                  {index + 1}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Student */}

                          <td className="px-5 py-4">
                            <div>
                              <p className="text-text-primary text-sm font-semibold">
                                {student.name || "Unknown Student"}
                              </p>

                              <p className="text-text-secondary text-xs mt-1">
                                {student.email || ""}
                              </p>

                              {student.codeforcesHandle && (
                                <p className="text-gold text-[11px] mt-1">
                                  @{student.codeforcesHandle}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Attendance */}

                          <td className="px-5 py-4 text-center">
                            <span className="text-sm text-text-primary">
                              {formatPercentage(attendance.percentage)}
                            </span>

                            <p className="text-[11px] text-text-secondary mt-1">
                              {attendance.present || 0}/
                              {attendance.applicable || 0}
                            </p>
                          </td>

                          {/* DSA */}

                          <td className="px-5 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Code2 size={15} className="text-gold" />

                              <span className="text-sm font-semibold text-text-primary">
                                {dsa.uniqueProblemsSolved || 0}
                              </span>
                            </div>

                            <p className="text-[11px] text-text-secondary mt-1">
                              {dsa.totalSubmissions || 0} submissions
                            </p>
                          </td>

                          {/* CP Contests */}

                          <td className="px-5 py-4 text-center">
                            <span className="text-sm text-text-primary">
                              {contests.participated || 0}
                            </span>
                          </td>

                          {/* CP Points */}

                          <td className="px-5 py-4 text-center">
                            <span className="text-sm font-semibold text-gold">
                              {contests.totalPoints || 0}
                            </span>
                          </td>

                          {/* CP Solved */}

                          <td className="px-5 py-4 text-center">
                            <span className="text-sm text-text-primary">
                              {contests.problemsSolved || 0}
                            </span>
                          </td>

                          {/* Assignments */}

                          <td className="px-5 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <ClipboardCheck
                                size={15}
                                className="text-emerald"
                              />

                              <span className="text-sm font-semibold text-text-primary">
                                {formatPercentage(assignment.averageScore)}
                              </span>
                            </div>

                            <p className="text-[11px] text-text-secondary mt-1">
                              {assignment.gradedSubmissions || 0} graded
                            </p>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
