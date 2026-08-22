import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Megaphone,
  X,
} from "lucide-react";

import AttendanceRing from "../../components/common/AttendanceRing";
import { getStudentDashboard } from "../../api/dashboard.api";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import Submission from "./SubmissionForm";

const FALLBACK_ANNOUNCEMENTS = [
  {
    title: "Guest talk: Building at scale",
    time: "1 day ago",
  },
  {
    title: "Batch 4 demo day moved to Friday",
    time: "3 days ago",
  },
];

// Same progress calculation used in MyProgress.jsx
const getProgressPercentage = (status) => {
  switch (status) {
    case "Completed":
      return 100;

    case "In Progress":
      return 50;

    case "Needs Improvement":
      return 35;

    case "Not Started":
    default:
      return 0;
  }
};

export default function StudentDashboard() {
  const { user } = useAuth();

  const [attendance, setAttendance] = useState(94);
  const [deadlines, setDeadlines] = useState([]);
  const [announcements, setAnnouncements] = useState(
    FALLBACK_ANNOUNCEMENTS,
  );
  const [topicProgress, setTopicProgress] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const loadDashboard = async () => {
      try {
        // ==========================================
        // STUDENT DASHBOARD
        // ==========================================

        const dashboardResponse =
          await getStudentDashboard();

        console.log(
          "STUDENT DASHBOARD RESPONSE:",
          dashboardResponse.data,
        );

        const data = dashboardResponse.data.data;

        console.log(
          "UPCOMING ASSIGNMENTS:",
          data.upcomingAssignments,
        );

        // ==========================================
        // ATTENDANCE
        // ==========================================

        setAttendance(
          data.attendancePercentage ?? 0,
        );

        // ==========================================
        // UPCOMING ASSIGNMENTS
        // ==========================================

        if (
          Array.isArray(
            data.upcomingAssignments,
          )
        ) {
          setDeadlines(
            data.upcomingAssignments,
          );
        } else {
          setDeadlines([]);
        }

        // ==========================================
        // ANNOUNCEMENTS
        // ==========================================

        if (
          Array.isArray(
            data.recentAnnouncements,
          )
        ) {
          setAnnouncements(
            data.recentAnnouncements.map((a) => ({
              title: a.title,
              time: a.publishDate
                ? new Date(
                    a.publishDate,
                  ).toLocaleDateString()
                : "",
            })),
          );
        }

        // ==========================================
        // REAL TOPIC PROGRESS
        // ==========================================

        const progressResponse =
          await axiosInstance.get("/progress", {
            params: {
              studentId: user.id,
            },
          });

        console.log(
          "STUDENT PROGRESS RESPONSE:",
          progressResponse.data,
        );

        setTopicProgress(
          progressResponse?.data?.data || [],
        );

        // ==========================================
        // LIVE DATA LOADED
        // ==========================================

        setIsLive(true);
      } catch (err) {
        console.error(
          "Failed to load student dashboard:",
          err,
        );

        setIsLive(false);
      }
    };

    loadDashboard();
  }, [user?.id]);

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)]"
        >
          My Dashboard
        </motion.h1>

        {!isLive && (
          <span className="text-xs px-2 py-1 rounded-full bg-warning/15 text-warning">
            Sample Data
          </span>
        )}
      </div>

      {/* ==========================================
          ATTENDANCE + TOPIC PROGRESS
          ========================================== */}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Attendance */}
        <div className="glass-card glow-border arch-top rounded-xl p-6 flex flex-col items-center justify-center">
          <AttendanceRing
            percentage={attendance}
          />
        </div>

        {/* Topic Progress */}
        <div className="glass-card glow-border rounded-xl p-5 lg:col-span-2">
          <h2 className="text-text-primary font-semibold mb-4">
            Topic Progress
          </h2>

          <div className="space-y-3">
            {topicProgress.length === 0 ? (
              <p className="text-text-secondary text-sm">
                No progress tracked yet.
              </p>
            ) : (
              topicProgress.map((item, index) => {
                const progress =
                  getProgressPercentage(
                    item.status,
                  );

                return (
                  <div
                    key={item._id || index}
                  >
                    {/* Topic name + percentage */}
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-primary">
                        {item.topic}
                      </span>

                      <span className="text-text-secondary">
                        {progress}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 rounded-full bg-border/40 overflow-hidden">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${progress}%`,
                        }}
                        transition={{
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-gold to-emerald"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          DEADLINES + ANNOUNCEMENTS
          ========================================== */}

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Upcoming Assignments */}
        <div className="glass-card glow-border rounded-xl p-5">
          <h2 className="text-text-primary font-semibold mb-4 flex items-center gap-2">
            <CalendarClock
              size={18}
              className="text-gold"
            />

            Upcoming Assignments
          </h2>

          <div className="space-y-3">
            {deadlines.length === 0 ? (
              <p className="text-text-secondary text-sm">
                No upcoming assignments.
              </p>
            ) : (
              deadlines.map((assignment) => (
                <div
                  key={assignment._id}
                  className="border-b border-border/50 last:border-0 pb-3 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-text-primary text-sm font-medium">
                        {assignment.title}
                      </p>

                      <p className="text-xs text-text-secondary mt-1">
                        Due{" "}
                        {assignment.deadline
                          ? new Date(
                              assignment.deadline,
                            ).toLocaleDateString()
                          : "No deadline"}{" "}
                        · Max{" "}
                        {assignment.maxScore}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setSelectedAssignment(
                          assignment,
                        )
                      }
                      className="shrink-0 text-xs px-3 py-1.5 rounded-lg text-gold border border-gold/30 hover:bg-gold/10 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Announcements */}
        <div className="glass-card glow-border rounded-xl p-5">
          <h2 className="text-text-primary font-semibold mb-4 flex items-center gap-2">
            <Megaphone
              size={18}
              className="text-gold"
            />

            Announcements
          </h2>

          <div className="space-y-3">
            {announcements.map(
              (announcement) => (
                <div
                  key={announcement.title}
                  className="border-b border-border/50 last:border-0 pb-3 last:pb-0"
                >
                  <p className="text-text-primary text-sm">
                    {announcement.title}
                  </p>

                  <p className="text-text-secondary text-xs mt-0.5">
                    {announcement.time}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          SELECTED ASSIGNMENT
          ========================================== */}

      {selectedAssignment && (
        <div className="glass-card glow-border rounded-xl p-6 mt-6">
          {/* Assignment Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                {selectedAssignment.title}
              </h2>

              <p className="text-sm text-text-secondary mt-1">
                Maximum Score:{" "}
                {selectedAssignment.maxScore}
              </p>
            </div>

            <button
              onClick={() =>
                setSelectedAssignment(null)
              }
              className="text-text-secondary hover:text-text-primary"
              aria-label="Close assignment"
            >
              <X size={20} />
            </button>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-text-primary font-semibold">
              Description
            </h3>

            <p className="text-text-secondary text-sm mt-2 whitespace-pre-line">
              {selectedAssignment.description}
            </p>
          </div>

          {/* Instructions */}
          <div className="mt-5">
            <h3 className="text-text-primary font-semibold">
              Instructions
            </h3>

            <p className="text-text-secondary text-sm mt-2 whitespace-pre-line">
              {selectedAssignment.instructions}
            </p>
          </div>

          {/* Deadline */}
          <div className="mt-5">
            <p className="text-sm text-text-secondary">
              Deadline:{" "}
              <span className="text-text-primary">
                {selectedAssignment.deadline
                  ? new Date(
                      selectedAssignment.deadline,
                    ).toLocaleDateString()
                  : "No deadline"}
              </span>
            </p>
          </div>

          {/* Submission Form */}
          <div className="border-t border-border/50 mt-6 pt-6">
            <h3 className="text-text-primary font-semibold mb-4">
              Submit Assignment
            </h3>

            <Submission
              assignmentId={
                selectedAssignment._id
              }
              onSubmitted={() => {
                setSelectedAssignment(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}