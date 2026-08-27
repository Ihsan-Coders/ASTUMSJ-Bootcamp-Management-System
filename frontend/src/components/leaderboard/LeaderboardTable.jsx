import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import { getLeaderboard } from "../api/leaderboard.api";
import { useAuth } from "../context/AuthContext";

export default function LeaderboardPage() {
  const { user } = useAuth();

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

        console.log("LEADERBOARD DATA:", response.data.data);

        setLeaderboard(response.data.data || []);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);

        setError(
          err?.response?.data?.message ||
            "Failed to load leaderboard. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadLeaderboard();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
        <p className="text-center text-text-secondary">
          Loading leaderboard...
        </p>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <Crown className="w-7 h-7 text-gold" />

          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)]">
            Bootcamp Leaderboard
          </h1>
        </motion.div>

        <p className="text-text-secondary text-sm sm:text-base">
          Track bootcamp performance across assignments, attendance, DSA
          activity, and competitive programming.
        </p>
      </div>

      {error && (
        <div className="glass-card glow-border rounded-xl p-4 mb-6">
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      {!error && <LeaderboardTable leaderboard={leaderboard} />}
    </div>
  );
}
