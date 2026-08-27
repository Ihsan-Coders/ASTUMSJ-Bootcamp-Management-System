import { useEffect, useState } from "react";
import { ExternalLink, Clock, CalendarDays, Trophy } from "lucide-react";
import { getContests } from "../../api/contest.api";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
const STATUS_COLOR = {
  Upcoming: "bg-gold/15 text-gold",
  Running: "bg-emerald/15 text-emerald",
  Finished: "bg-text-secondary/15 text-text-secondary",
  Cancelled: "bg-danger/15 text-danger",
};

export default function MentorContests() {
  const { user } = useAuth();

  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadContests = async () => {
      try {
        setLoading(true);
        setError("");

        const batchId =
          user?.batch?._id || user?.batch?.id || user?.batchId || user?.batch;

        const response = await getContests(batchId);

        setContests(response?.data?.data || []);
      } catch (err) {
        console.error("Failed to load mentor contests:", err);

        setError(
          err?.response?.data?.message ||
            "Failed to load contests. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadContests();
    }
  }, [user]);

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleString();
  };

  const getButtonText = (status) => {
    if (status === "Upcoming") return "View Contest";
    if (status === "Running") return "Enter Contest";
    if (status === "Finished") return "View Results";

    return "View Contest";
  };

  if (loading) {
    return (
      <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
        <p className="text-center text-text-secondary">Loading contests...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="text-gold" size={28} />

          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Weekly CP Contests
          </h1>
        </div>

        <p className="text-text-secondary text-sm sm:text-base">
          View competitive programming contests for your assigned batch.
        </p>
      </div>

      {error && (
        <div className="glass-card glow-border rounded-xl p-4 mb-6">
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      {!error && contests.length === 0 && (
        <div className="glass-card glow-border rounded-xl p-10 text-center">
          <Trophy size={40} className="mx-auto mb-4 text-text-secondary" />

          <h2 className="text-lg font-semibold text-text-primary mb-2">
            No contests available
          </h2>

          <p className="text-sm text-text-secondary">
            Your batch does not have any contests yet.
          </p>
        </div>
      )}

      <div className="grid gap-5">
        {contests.map((contest) => (
          <div
            key={contest._id}
            className="glass-card glow-border rounded-xl p-5 sm:p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
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

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-5 text-sm text-text-secondary">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={15} />
                    {formatDate(contest.startTime)}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Clock size={15} />
                    {contest.durationMinutes} minutes
                  </span>
                </div>

                {contest.problems?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {contest.problems.map((problem) => (
                      <span
                        key={problem.index}
                        className="text-xs px-2.5 py-1 rounded-full bg-gold/10 text-gold"
                      >
                        {problem.index}
                        {problem.name ? ` � ${problem.name}` : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Contest actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 flex-shrink-0">
                {/* View / Enter Contest */}
                {contest.contestUrl ? (
                  <a
                    href={contest.contestUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-auto lg:w-full xl:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-obsidian bg-gradient-to-r from-gold to-emerald hover:opacity-90 transition-opacity"
                  >
                    {getButtonText(contest.status)}
                    <ExternalLink size={16} />
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm text-text-secondary bg-background border border-border">
                    Contest link unavailable
                  </span>
                )}

                {/* Leaderboard */}
                <Link
                  to={`/mentor/contests/${contest._id}/leaderboard`}
                  className="inline-flex w-full sm:w-auto lg:w-full xl:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
                >
                  <Trophy size={16} />
                  Leaderboard
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
