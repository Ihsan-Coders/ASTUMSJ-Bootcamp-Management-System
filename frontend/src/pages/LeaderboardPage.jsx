import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import { getLeaderboard } from "../api/leaderboard.api";

const FALLBACK_LEADERBOARD = [
  {
    student: { id: 1, name: "Selam Tesfaye" },
    avgScore: 96,
    attendancePct: 98,
    combinedScore: 97,
  },
  {
    student: { id: 2, name: "Bethelhem Assefa" },
    avgScore: 91,
    attendancePct: 94,
    combinedScore: 92,
  },
  {
    student: { id: 3, name: "Dawit Alemu" },
    avgScore: 85,
    attendancePct: 88,
    combinedScore: 86,
  },
  {
    student: { id: 4, name: "Yonas Kebede" },
    avgScore: 78,
    attendancePct: 75,
    combinedScore: 77,
  },
];

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState(FALLBACK_LEADERBOARD);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    getLeaderboard()
      .then((res) => {
        setLeaderboard(res.data.data);
        setIsLive(true);
      })
      .catch(() => setIsLive(false));
  }, []);

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)] flex items-center gap-2"
        >
          <Crown className="w-7 h-7 text-gold" /> Leaderboard
        </motion.h1>
        {!isLive && (
          <span className="text-xs px-2 py-1 rounded-full bg-warning/15 text-warning">
            Sample Data
          </span>
        )}
      </div>

      <LeaderboardTable leaderboard={leaderboard} />
    </div>
  );
}
