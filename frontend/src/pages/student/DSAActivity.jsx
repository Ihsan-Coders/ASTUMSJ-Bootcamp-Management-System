import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  GitBranch,
  Link as LinkIcon,
  Plus,
  Trophy,
  Code2,
} from "lucide-react";

import {
  createDSAProblem,
  getMyDSAProblems,
  getWeeklyDSAActivity,
} from "../../api/dsaProblem.api";

const WEEKLY_TARGET = 10;

const getWeekRange = () => {
  const today = new Date();

  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(today);
  start.setDate(today.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

const PLATFORM_STYLES = {
  Codeforces: "bg-gold/10 text-gold",
  LeetCode: "bg-emerald/10 text-emerald",
};

export default function DSAActivity() {
  const { user } = useAuth();

  const [problems, setProblems] = useState([]);
  const [weeklyCount, setWeeklyCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    problemLink: "",
    platform: "Codeforces",
    timeTakenMinutes: "",
    solutionUrl: "",
  });

  const week = useMemo(() => getWeekRange(), []);

  const loadActivity = async () => {
    try {
      setLoading(true);
      setError("");

      const [problemsResponse, weeklyResponse] = await Promise.all([
        getMyDSAProblems(),
        getWeeklyDSAActivity(week.start, week.end),
      ]);

      setProblems(problemsResponse?.data?.data || []);

      const weeklyStudents = weeklyResponse?.data?.data?.students || [];

      const myActivity = weeklyStudents.find(
        (student) => student.student?.id?.toString() === user?.id?.toString(),
      );

      setWeeklyCount(myActivity?.problemCount || 0);
    } catch (err) {
      console.error("Failed to load DSA activity:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load your DSA activity. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await createDSAProblem({
        problemLink: form.problemLink,
        platform: form.platform,
        timeTakenMinutes: Number(form.timeTakenMinutes),
        solutionUrl: form.solutionUrl,
      });

      setForm({
        problemLink: "",
        platform: "Codeforces",
        timeTakenMinutes: "",
        solutionUrl: "",
      });

      setSuccess("Problem submitted successfully.");

      await loadActivity();
    } catch (err) {
      console.error("Failed to submit DSA problem:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to submit the problem. Please check your information.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercentage = Math.min((weeklyCount / WEEKLY_TARGET) * 100, 100);

  if (loading) {
    return (
      <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
        <p className="text-center text-text-secondary">
          Loading DSA activity...
        </p>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Code2 className="text-gold" size={28} />

          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            DSA Activity
          </h1>
        </div>

        <p className="text-sm sm:text-base text-text-secondary">
          Record the problems you solve and track your weekly problem-solving
          activity.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="glass-card glow-border rounded-xl p-4 mb-6">
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="glass-card glow-border rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-emerald text-sm">
            <CheckCircle2 size={17} />
            {success}
          </div>
        </div>
      )}

      {/* Weekly Progress */}
      <div className="glass-card glow-border rounded-xl p-5 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={18} className="text-gold" />

              <h2 className="font-semibold text-text-primary">This Week</h2>
            </div>

            <p className="text-sm text-text-secondary">
              Weekly target: {WEEKLY_TARGET} problems
            </p>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-2xl font-bold text-gold">
              {weeklyCount}
              <span className="text-text-secondary text-base">
                {" "}
                / {WEEKLY_TARGET}
              </span>
            </div>

            <p className="text-xs text-text-secondary">unique problems</p>
          </div>
        </div>

        <div className="h-3 rounded-full bg-background overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold to-emerald transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Submit Problem */}
      <div className="glass-card glow-border rounded-xl p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Plus size={20} className="text-gold" />

          <h2 className="text-lg font-semibold text-text-primary">
            Record Solved Problem
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Problem Link */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Problem Link
            </label>

            <div className="relative">
              <LinkIcon
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />

              <input
                type="url"
                name="problemLink"
                value={form.problemLink}
                onChange={handleChange}
                placeholder="https://codeforces.com/problemset/problem/..."
                required
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Platform + Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Platform
              </label>

              <select
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary outline-none focus:border-gold"
              >
                <option value="Codeforces">Codeforces</option>
                <option value="LeetCode">LeetCode</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Time Taken (minutes)
              </label>

              <div className="relative">
                <Clock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />

                <input
                  type="number"
                  name="timeTakenMinutes"
                  value={form.timeTakenMinutes}
                  onChange={handleChange}
                  min="1"
                  max="1440"
                  placeholder="e.g. 45"
                  required
                  className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {/* Solution URL */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Solution / Repository Link
            </label>

            <div className="relative">
              <GitBranch
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />

              <input
                type="url"
                name="solutionUrl"
                value={form.solutionUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
                required
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary outline-none focus:border-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-obsidian bg-gradient-to-r from-gold to-emerald hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <Plus size={17} />

            {submitting ? "Submitting..." : "Submit Problem"}
          </button>
        </form>
      </div>

      {/* Problem History */}
      <div className="glass-card glow-border rounded-xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">
            My Solved Problems
          </h2>

          <p className="text-sm text-text-secondary mt-1">
            Your recorded DSA problem activity.
          </p>
        </div>

        {problems.length === 0 ? (
          <div className="p-10 text-center">
            <Code2 size={40} className="mx-auto mb-4 text-text-secondary" />

            <p className="text-text-secondary text-sm">
              You haven't recorded any problems yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {problems.map((problem) => (
              <div
                key={problem._id}
                className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        PLATFORM_STYLES[problem.platform] ||
                        "bg-text-secondary/10 text-text-secondary"
                      }`}
                    >
                      {problem.platform}
                    </span>

                    <span className="text-xs text-text-secondary">
                      {new Date(problem.submittedAt).toLocaleString()}
                    </span>
                  </div>

                  <a
                    href={problem.problemLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base text-text-primary hover:text-gold transition-colors break-all inline-flex items-center gap-2"
                  >
                    {problem.problemLink}
                    <ExternalLink size={14} className="shrink-0" />
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-4 shrink-0">
                  <div>
                    <p className="text-xs text-text-secondary">Time Taken</p>

                    <p className="text-sm font-semibold text-text-primary">
                      {problem.timeTakenMinutes} min
                    </p>
                  </div>

                  {problem.solutionUrl && (
                    <a
                      href={problem.solutionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gold/30 text-gold text-sm hover:bg-gold/10 transition-colors"
                    >
                      <GitBranch size={15} />
                      Solution
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
