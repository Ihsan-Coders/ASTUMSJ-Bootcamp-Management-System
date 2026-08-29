import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Trophy } from "lucide-react";
import { motion } from "framer-motion";

import { getContestById, getContestLeaderboard } from "../../api/contest.api";

import ContestLeaderboardTable from "../../components/admin/ContestLeaderboardTable";

export default function ContestLeaderboardPage() {
  const { id } = useParams();
  const location = useLocation();

  const [contest, setContest] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Determine which role opened this leaderboard.
   *
   * /admin/contests/:id/leaderboard
   * /mentor/contests/:id/leaderboard
   * /student/contests/:id/leaderboard
   */
  const isAdmin = location.pathname.startsWith("/admin/");
  const isMentor = location.pathname.startsWith("/mentor/");
  const isStudent = location.pathname.startsWith("/student/");

  /*
   * Correct "Back" destination based on role.
   */
  const backPath = isAdmin
    ? `/admin/contests/${id}`
    : isMentor
      ? "/mentor/contests"
      : "/student/contests";

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [contestRes, leaderboardRes] = await Promise.all([
          getContestById(id),
          getContestLeaderboard(id),
        ]);

        setContest(contestRes?.data?.data || null);

        const data = leaderboardRes?.data?.data;

        setResults(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.leaderboard)
              ? data.leaderboard
              : [],
        );
      } catch (err) {
        console.error("Load contest leaderboard error:", err);

        setError(
          err?.response?.data?.message || "Failed to load contest leaderboard",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadLeaderboard();
    }
  }, [id]);

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
        <p className="text-center text-text-secondary">
          Loading leaderboard...
        </p>
      </div>
    );
  }

  /*
   * Error
   */
  if (error || !contest) {
    return (
      <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
        <div className="glass-card glow-border rounded-xl p-8 text-center">
          <Trophy size={40} className="mx-auto mb-4 text-text-secondary" />

          <p className="text-danger mb-5">{error || "Contest not found"}</p>

          <Link
            to={backPath}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-obsidian font-semibold"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </div>
    );
  }

  /*
   * Page
   */
  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        {/* Back button */}
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors mb-5"
        >
          <ArrowLeft size={16} />

          {isAdmin ? "Back to Contest" : "Back to Contests"}
        </Link>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="text-gold" size={28} />

          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            {contest.name} Leaderboard
          </h1>
        </div>

        <p className="text-sm text-text-secondary">
          Contest rankings and participant results.
        </p>
      </motion.div>

      {/* Contest information */}
      <div className="glass-card glow-border rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
          <span>
            Start:{" "}
            {contest.startTime
              ? new Date(contest.startTime).toLocaleString()
              : "N/A"}
          </span>

          <span>Duration: {contest.durationMinutes ?? 0} minutes</span>

          <span>Problems: {contest.problems?.length ?? 0}</span>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass-card glow-border rounded-xl p-4 sm:p-6">
        <ContestLeaderboardTable results={results} />
      </div>
    </div>
  );
}
