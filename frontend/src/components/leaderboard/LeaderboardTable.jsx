import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";

const RANK_STYLES = [
  {
    icon: Trophy,
    color: "text-gold",
    glow: "shadow-[0_0_15px_rgba(212,175,55,0.3)]",
  },
  { icon: Medal, color: "text-emerald", glow: "" },
  { icon: Award, color: "text-text-secondary", glow: "" },
];

export default function LeaderboardTable({ leaderboard = [] }) {
  if (leaderboard.length === 0) {
    return (
      <div className="glass-card glow-border rounded-xl p-8 text-center text-text-secondary">
        No leaderboard data yet — start submitting and grading assignments!
      </div>
    );
  }

  return (
    <div className="glass-card glow-border rounded-xl overflow-hidden">
      {leaderboard.map((entry, i) => {
        const rankStyle = RANK_STYLES[i];
        const RankIcon = rankStyle?.icon;

        return (
          <motion.div
            key={entry.student.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center justify-between p-4 border-b border-border/50 last:border-0 ${rankStyle?.glow || ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 flex justify-center">
                {RankIcon ? (
                  <RankIcon className={`w-5 h-5 ${rankStyle.color}`} />
                ) : (
                  <span className="text-text-secondary text-sm font-semibold">
                    #{i + 1}
                  </span>
                )}
              </div>
              <span className="text-text-primary font-medium">
                {entry.student.name}
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="text-right hidden sm:block">
                <div className="text-text-secondary text-xs">Avg Score</div>
                <div className="text-text-primary">{entry.avgScore}%</div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-text-secondary text-xs">Attendance</div>
                <div className="text-text-primary">{entry.attendancePct}%</div>
              </div>
              <div className="text-right w-16">
                <div className="text-text-secondary text-xs">Score</div>
                <div className="text-gold font-bold text-lg">
                  {entry.combinedScore}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
