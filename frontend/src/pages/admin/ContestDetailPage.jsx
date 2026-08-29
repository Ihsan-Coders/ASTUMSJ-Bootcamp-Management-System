import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCw, ExternalLink, Trophy, ArrowLeft } from "lucide-react";

import {
  getContestById,
  fetchContestResults,
  getContestLeaderboard,
} from "../../api/contest.api";

import ContestLeaderboardTable from "../../components/admin/ContestLeaderboardTable";

const STATUS_COLOR = {
  Upcoming: "bg-gold/15 text-gold",
  Running: "bg-emerald/15 text-emerald",
  Finished: "bg-text-secondary/15 text-text-secondary",
  Cancelled: "bg-danger/15 text-danger",
};

export default function ContestDetailPage() {
  const { id } = useParams();

  const [contest, setContest] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [fetchSummary, setFetchSummary] = useState(null);
  const [error, setError] = useState("");

  const loadAll = async () => {
    setLoading(true);
    setError("");

    try {
      const [contestRes, leaderboardRes] = await Promise.all([
        getContestById(id),
        getContestLeaderboard(id),
      ]);

      setContest(contestRes?.data?.data);

      const data = leaderboardRes?.data?.data;

      setResults(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.leaderboard)
            ? data.leaderboard
            : [],
      );
    } catch (err) {
      console.error("Load contest error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load contest. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadAll();
    }
  }, [id]);

  const handleFetch = async () => {
    setFetching(true);
    setFetchSummary(null);
    setError("");

    try {
      const res = await fetchContestResults(id);

      setFetchSummary(res?.data?.data);

      const leaderboardRes = await getContestLeaderboard(id);

      const data = leaderboardRes?.data?.data;

      setResults(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.leaderboard)
            ? data.leaderboard
            : [],
      );
    } catch (err) {
      console.error("Fetch results error:", err);

      setError(
        err?.response?.data?.message || "Failed to fetch contest results.",
      );
    } finally {
      setFetching(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 sm:pt-28 px-4 sm:px-6">
        <p className="text-center text-text-secondary">Loading contest...</p>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="pt-24 sm:pt-28 px-4 sm:px-6">
        <div className="glass-card glow-border rounded-xl p-8 text-center">
          <p className="text-danger mb-4">{error || "Contest not found."}</p>

          <Link
            to="/admin/contests"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-obsidian font-semibold"
          >
            <ArrowLeft size={16} />
            Back to Contests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      {/* Back button */}
      <Link
        to="/admin/contests"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors mb-5"
      >
        <ArrowLeft size={16} />
        Back to Contests
      </Link>

      {/* Contest Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card glow-border rounded-xl p-5 sm:p-6 mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Trophy className="text-gold" size={24} />

              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                {contest.name}
              </h1>

              <span
                className={`text-xs px-2.5 py-1 rounded-full ${
                  STATUS_COLOR[contest.status] ||
                  "bg-text-secondary/15 text-text-secondary"
                }`}
              >
                {contest.status}
              </span>
            </div>

            <p className="text-text-secondary text-sm">
              {new Date(contest.startTime).toLocaleString()}
              {" · "}
              {contest.durationMinutes} minutes
            </p>
          </div>

          {/* View Contest */}
          {contest.contestUrl && (
            <a
              href={contest.contestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-obsidian bg-gradient-to-r from-gold to-emerald hover:opacity-90 transition-opacity"
            >
              View Contest
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </motion.div>

      {/* Problems */}
      {contest.problems?.length > 0 && (
        <div className="glass-card glow-border rounded-xl p-4 mb-6">
          <h3 className="text-sm text-text-secondary mb-2">Problems</h3>

          <div className="flex flex-wrap gap-2">
            {contest.problems.map((problem) => (
              <span
                key={problem.index}
                className="text-xs px-2.5 py-1 rounded-full bg-gold/10 text-gold"
              >
                {problem.index}
                {problem.name ? ` — ${problem.name}` : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ============================= */}
      {/* LEADERBOARD SECTION */}
      {/* ============================= */}

      <div id="leaderboard" className="scroll-mt-24">
        {/* Leaderboard Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-gold" />

            <h2 className="text-lg font-semibold text-text-primary">
              Leaderboard
            </h2>
          </div>

          <button
            onClick={handleFetch}
            disabled={fetching}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
          >
            <RefreshCw size={14} className={fetching ? "animate-spin" : ""} />

            {fetching ? "Fetching..." : "Fetch Results"}
          </button>
        </div>

        {/* Fetch Summary */}
        {fetchSummary && (
          <div className="glass-card glow-border rounded-lg p-4 mb-4 flex flex-wrap gap-4 text-sm">
            <span className="text-emerald">
              Fetched: {fetchSummary.fetched ?? 0}
            </span>

            <span className="text-text-secondary">
              Not participated: {fetchSummary.notParticipated ?? 0}
            </span>

            <span className="text-warning">
              No handle: {fetchSummary.noHandle ?? 0}
            </span>

            <span className="text-danger">
              Invalid handle: {fetchSummary.invalidHandle ?? 0}
            </span>

            {fetchSummary.apiUnavailable > 0 && (
              <span className="text-danger">
                API unavailable: {fetchSummary.apiUnavailable}
              </span>
            )}
          </div>
        )}

        {/* Error */}
        {error && <p className="text-danger text-sm mb-4">{error}</p>}

        {/* Leaderboard Table */}
        <ContestLeaderboardTable results={results} />
      </div>
    </div>
  );
}
