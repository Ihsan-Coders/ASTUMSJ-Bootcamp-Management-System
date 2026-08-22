import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Circle,
  AlertTriangle,
  Target,
  FileText,
  TrendingUp,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const STATUS_CONFIG = {
  "Not Started": {
    icon: Circle,
    color: "text-white/50",
    bg: "bg-white/5",
    border: "border-white/10",
    progress: 0,
  },

  "In Progress": {
    icon: Clock3,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    progress: 50,
  },

  Completed: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    progress: 100,
  },

  "Needs Improvement": {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    progress: 35,
  },
};

export default function MyProgress() {
  const { user } = useAuth();

  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    const loadProgress = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get("/progress", {
          params: {
            studentId: user.id,
          },
        });

        setProgress(response?.data?.data || []);
      } catch (error) {
        console.error("Failed to load progress:", error);

        setError(
          error?.response?.data?.message ||
            "Unable to load progress.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user?.id]);

  const statistics = useMemo(() => {
    const total = progress.length;

    const completed = progress.filter(
      (item) => item.status === "Completed",
    ).length;

    const inProgress = progress.filter(
      (item) => item.status === "In Progress",
    ).length;

    const needsImprovement = progress.filter(
      (item) => item.status === "Needs Improvement",
    ).length;

    const notStarted = progress.filter(
      (item) => item.status === "Not Started",
    ).length;

    /*
     * We use the same status percentages shown for each topic:
     *
     * Not Started       = 0%
     * In Progress       = 50%
     * Needs Improvement = 35%
     * Completed         = 100%
     *
     * This gives the student a meaningful overall percentage
     * while keeping the backend status-based design.
     */
    const overallProgress =
      total > 0
        ? Math.round(
            progress.reduce((totalProgress, item) => {
              const percentage =
                STATUS_CONFIG[item.status]?.progress ?? 0;

              return totalProgress + percentage;
            }, 0) / total,
          )
        : 0;

    return {
      total,
      completed,
      inProgress,
      needsImprovement,
      notStarted,
      overallProgress,
    };
  }, [progress]);

  return (
    <div
      className="
        min-h-screen
        bg-[#051C14]
        text-[#F8F9FA]
        relative
        overflow-hidden
      "
    >
      {/* Islamic geometric background */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.035]
          pointer-events-none
        "
        style={{
          backgroundImage: `
            linear-gradient(
              45deg,
              transparent 48%,
              #D4AF37 49%,
              transparent 51%
            ),
            linear-gradient(
              -45deg,
              transparent 48%,
              #D4AF37 49%,
              transparent 51%
            )
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Emerald glow */}
      <div
        className="
          absolute
          top-20
          left-1/2
          -translate-x-1/2
          w-[500px]
          h-[300px]
          bg-emerald-500/10
          blur-[120px]
          rounded-full
        "
      />

      <main
        className="
          relative
          z-10
          max-w-6xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          pt-24
          pb-20
        "
      >
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8"
        >
          <h1
            className="
              text-3xl
              sm:text-4xl
              font-bold
            "
          >
            My Progress
          </h1>

          <p className="text-white/50 mt-2">
            Track your learning progress and topic mastery.
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  h-28
                  rounded-2xl
                  bg-white/5
                  border border-white/5
                  animate-pulse
                "
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            className="
              rounded-3xl
              border border-red-400/20
              bg-[rgba(10,35,26,0.75)]
              p-8
              text-center
              backdrop-blur-xl
            "
          >
            <AlertTriangle
              className="
                w-10
                h-10
                text-red-400
                mx-auto
                mb-4
              "
            />

            <h2 className="text-xl font-semibold">
              Unable to load progress
            </h2>

            <p className="text-red-400 text-sm mt-2">
              {error}
            </p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Overview */}
            <motion.section
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                relative
                overflow-hidden
                rounded-3xl
                border border-[#D4AF37]/20
                bg-[rgba(10,35,26,0.75)]
                backdrop-blur-2xl
                p-6
                sm:p-8
                mb-6
              "
            >
              <div
                className="
                  absolute
                  top-0
                  left-1/2
                  -translate-x-1/2
                  w-44
                  h-1
                  bg-gradient-to-r
                  from-transparent
                  via-[#D4AF37]
                  to-transparent
                "
              />

              <div
                className="
                  grid
                  lg:grid-cols-[1fr_1.5fr]
                  gap-8
                  items-center
                "
              >
                {/* Progress Circle */}
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-6
                  "
                >
                  <div
                    className="
                      relative
                      w-32
                      h-32
                      shrink-0
                    "
                  >
                    <svg
                      className="
                        w-full
                        h-full
                        -rotate-90
                      "
                      viewBox="0 0 120 120"
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="9"
                      />

                      <motion.circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray="314"
                        initial={{
                          strokeDashoffset: 314,
                        }}
                        animate={{
                          strokeDashoffset:
                            314 -
                            (314 *
                              statistics.overallProgress) /
                              100,
                        }}
                        transition={{
                          duration: 1.2,
                        }}
                      />
                    </svg>

                    <div
                      className="
                        absolute
                        inset-0
                        flex
                        flex-col
                        items-center
                        justify-center
                      "
                    >
                      <span className="text-2xl font-bold">
                        {statistics.overallProgress}%
                      </span>

                      <span className="text-[10px] text-white/40">
                        Overall
                      </span>
                    </div>
                  </div>

                  <div>
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        mb-2
                      "
                    >
                      <Target
                        className="
                          w-5
                          h-5
                          text-[#D4AF37]
                        "
                      />

                      <h2 className="text-xl font-semibold">
                        Overall Progress
                      </h2>
                    </div>

                    <p
                      className="
                        text-white/50
                        text-sm
                        max-w-xs
                      "
                    >
                      Keep learning and complete each
                      topic step by step.
                    </p>
                  </div>
                </div>

                {/* Statistics */}
                <div
                  className="
                    grid
                    grid-cols-2
                    sm:grid-cols-4
                    gap-3
                  "
                >
                  <Stat
                    icon={BookOpen}
                    label="Total Topics"
                    value={statistics.total}
                    color="text-white/70"
                  />

                  <Stat
                    icon={CheckCircle2}
                    label="Completed"
                    value={statistics.completed}
                    color="text-emerald-400"
                  />

                  <Stat
                    icon={Clock3}
                    label="In Progress"
                    value={statistics.inProgress}
                    color="text-amber-400"
                  />

                  <Stat
                    icon={AlertTriangle}
                    label="Needs Work"
                    value={statistics.needsImprovement}
                    color="text-red-400"
                  />
                </div>
              </div>
            </motion.section>

            {/* Empty State */}
            {progress.length === 0 && (
              <div
                className="
                  rounded-3xl
                  border border-[#D4AF37]/15
                  bg-[rgba(10,35,26,0.75)]
                  p-10
                  text-center
                  backdrop-blur-xl
                "
              >
                <BookOpen
                  className="
                    w-10
                    h-10
                    text-[#D4AF37]
                    mx-auto
                    mb-4
                  "
                />

                <h2 className="text-xl font-semibold">
                  No Progress Tracked Yet
                </h2>

                <p
                  className="
                    text-white/50
                    max-w-md
                    mx-auto
                    mt-2
                  "
                >
                  Your mentor will update your progress
                  as you complete topics.
                </p>
              </div>
            )}

            {/* Topic Progress */}
            {progress.length > 0 && (
              <section>
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-4
                  "
                >
                  <div>
                    <h2
                      className="
                        text-xl
                        sm:text-2xl
                        font-bold
                      "
                    >
                      Topic Progress
                    </h2>

                    <p
                      className="
                        text-white/40
                        text-sm
                        mt-1
                      "
                    >
                      Your learning progress by topic
                    </p>
                  </div>

                  <span className="text-sm text-white/40">
                    {statistics.total} topics
                  </span>
                </div>

                <div className="space-y-3">
                  {progress.map((item, index) => {
                    const config =
                      STATUS_CONFIG[item.status] ||
                      STATUS_CONFIG["Not Started"];

                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={item._id || index}
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.05,
                        }}
                        whileHover={{
                          y: -2,
                        }}
                        className="
                          group
                          rounded-2xl
                          border border-[#D4AF37]/10
                          hover:border-[#D4AF37]/30
                          bg-[rgba(10,35,26,0.72)]
                          backdrop-blur-xl
                          p-5
                        "
                      >
                        <div
                          className="
                            flex
                            flex-col
                            gap-4
                          "
                        >
                          {/* Topic + Status */}
                          <div
                            className="
                              flex
                              flex-col
                              sm:flex-row
                              sm:items-center
                              justify-between
                              gap-3
                            "
                          >
                            <div
                              className="
                                flex
                                items-center
                                gap-4
                              "
                            >
                              <div
                                className="
                                  w-10
                                  h-10
                                  rounded-xl
                                  bg-[#D4AF37]/10
                                  border border-[#D4AF37]/20
                                  flex
                                  items-center
                                  justify-center
                                  text-[#D4AF37]
                                  font-bold
                                  text-sm
                                "
                              >
                                {String(index + 1).padStart(
                                  2,
                                  "0",
                                )}
                              </div>

                              <div>
                                <h3 className="font-semibold">
                                  {item.topic}
                                </h3>

                                <p
                                  className="
                                    text-xs
                                    text-white/35
                                    mt-1
                                  "
                                >
                                  Topic {index + 1} of{" "}
                                  {statistics.total}
                                </p>
                              </div>
                            </div>

                            {/* Status */}
                            <div
                              className={`
                                flex
                                items-center
                                gap-2
                                w-fit
                                px-3
                                py-1.5
                                rounded-full
                                border
                                text-xs
                                font-semibold
                                ${config.bg}
                                ${config.border}
                                ${config.color}
                              `}
                            >
                              <Icon className="w-3.5 h-3.5" />

                              {item.status}
                            </div>
                          </div>

                          {/* Progress */}
                          <div>
                            <div
                              className="
                                flex
                                justify-between
                                mb-2
                              "
                            >
                              <span
                                className="
                                  text-xs
                                  text-white/35
                                "
                              >
                                Progress
                              </span>

                              <span
                                className="
                                  text-xs
                                  text-white/60
                                "
                              >
                                {config.progress}%
                              </span>
                            </div>

                            <div
                              className="
                                h-2
                                bg-white/5
                                rounded-full
                                overflow-hidden
                              "
                            >
                              <motion.div
                                initial={{
                                  width: 0,
                                }}
                                animate={{
                                  width: `${config.progress}%`,
                                }}
                                transition={{
                                  duration: 0.8,
                                  delay: index * 0.05,
                                }}
                                className={`
                                  h-full
                                  rounded-full
                                  ${
                                    item.status ===
                                    "Completed"
                                      ? "bg-emerald-400"
                                      : item.status ===
                                        "In Progress"
                                      ? "bg-amber-400"
                                      : item.status ===
                                        "Needs Improvement"
                                      ? "bg-red-400"
                                      : "bg-white/20"
                                  }
                                `}
                              />
                            </div>
                          </div>

                          {/* Mentor Notes */}
                          {item.notes && (
                            <div
                              className="
                                flex
                                gap-3
                                rounded-xl
                                bg-white/[0.025]
                                border border-white/5
                                p-3
                              "
                            >
                              <FileText
                                className="
                                  w-4
                                  h-4
                                  text-[#D4AF37]
                                  shrink-0
                                "
                              />

                              <div>
                                <p
                                  className="
                                    text-xs
                                    text-white/35
                                    mb-1
                                  "
                                >
                                  Mentor Notes
                                </p>

                                <p
                                  className="
                                    text-sm
                                    text-white/55
                                  "
                                >
                                  {item.notes}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Footer */}
            {progress.length > 0 && (
              <div
                className="
                  mt-6
                  rounded-2xl
                  border border-[#D4AF37]/10
                  bg-[#D4AF37]/[0.025]
                  p-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      w-11
                      h-11
                      rounded-xl
                      bg-[#D4AF37]/10
                      border border-[#D4AF37]/20
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <TrendingUp
                      className="
                        w-5
                        h-5
                        text-[#D4AF37]
                      "
                    />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Keep moving forward
                    </p>

                    <p
                      className="
                        text-sm
                        text-white/40
                        mt-1
                      "
                    >
                      Small progress every day builds a
                      strong developer.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
}) {
  return (
    <div
      className="
        rounded-2xl
        border border-white/5
        bg-white/[0.035]
        p-3
      "
    >
      <Icon className={`w-4 h-4 ${color} mb-3`} />

      <p className="text-xl font-bold">
        {value}
      </p>

      <p className="text-xs text-white/40 mt-1">
        {label}
      </p>
    </div>
  );
}