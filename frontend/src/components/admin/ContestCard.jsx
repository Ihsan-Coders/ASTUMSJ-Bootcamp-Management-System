import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";

const STATUS_COLOR = {
  Upcoming: "bg-gold/15 text-gold",
  Running: "bg-emerald/15 text-emerald",
  Finished: "bg-text-secondary/15 text-text-secondary",
  Cancelled: "bg-danger/15 text-danger",
};

export default function ContestCard({ contest }) {
  return (
    <div className="glass-card glow-border rounded-xl p-5 hover:-translate-y-0.5 transition-transform">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2 className="text-text-primary font-semibold text-lg">
              {contest.name}
            </h2>

            <span
              className={`text-xs px-2.5 py-1 rounded-full ${
                STATUS_COLOR[contest.status] ||
                "bg-text-secondary/15 text-text-secondary"
              }`}
            >
              {contest.status}
            </span>
          </div>

          <p className="text-text-secondary text-xs">
            {new Date(contest.startTime).toLocaleString()}
            {" · "}
            {contest.durationMinutes} min
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          {/* View Contest */}
          <Link
            to={`/admin/contests/${contest._id}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald hover:opacity-90 transition-opacity"
          >
            View Contest
          </Link>

          {/* Leaderboard */}
          <Link
            to={`/admin/contests/${contest._id}/leaderboard`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gold border border-gold/30 hover:bg-gold/10 transition-colors"
          >
            <Trophy size={15} />
            Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}
