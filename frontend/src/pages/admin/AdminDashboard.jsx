import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  Layers,
  CalendarCheck,
  ClipboardList,
} from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import AnnouncementForm from "../../components/announcements/AnnouncementForm";
import AnnouncementCard from "../../components/announcements/AnnouncementCard";
import { getAdminDashboard } from "../../api/dashboard.api";
import { getAnnouncements } from "../../api/announcement.api";
import { getRegistrationStatus, updateRegistrationStatus } from '../../api/settings.api';

// Fallback sample data — shown if the backend isn't ready yet or a request fails.
// This keeps the dashboard looking complete during development or a live demo
// even if a real API call hiccups.
const FALLBACK_STATS = {
  studentCount: 128,
  mentorCount: 12,
  batchCount: 4,
  attendanceRate: 94,
  gradedSubmissions: 312,
};

const FALLBACK_USERS = [
  {
    id: 1,
    name: "Bethelhem Assefa",
    email: "bethelhem@astu.edu.et",
    role: "Student",
    batch: "Batch 4",
  },
  {
    id: 2,
    name: "Nahom Girma",
    email: "nahom@astu.edu.et",
    role: "Mentor",
    batch: "Batch 3",
  },
  {
    id: 3,
    name: "Selam Tesfaye",
    email: "selam@astu.edu.et",
    role: "Student",
    batch: "Batch 4",
  },
];

const FALLBACK_BATCHES = [
  { id: 1, name: "Batch 4 — Summer", students: 34, status: "Active" },
  { id: 2, name: "Batch 3 — Spring", students: 29, status: "Completed" },
];

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-gradient-to-r from-gold to-emerald text-obsidian"
          : "text-text-secondary hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [users, setUsers] = useState(FALLBACK_USERS);
  const [batches, setBatches] = useState(FALLBACK_BATCHES);
  const [isLive, setIsLive] = useState(false); // tracks whether we're showing real or fallback data

  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [announcementsError, setAnnouncementsError] = useState("");
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [regLoading, setRegLoading] = useState(true);

  const loadRecentAnnouncements = () => {
    setLoadingAnnouncements(true);
    getAnnouncements()
      .then((res) => {
        setRecentAnnouncements((res.data.data || []).slice(0, 5));
        setAnnouncementsError("");
      })
      .catch((err) => {
        setAnnouncementsError(
          err?.response?.data?.message || "Failed to load announcements",
        );
      })
      .finally(() => setLoadingAnnouncements(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRecentAnnouncements();
  }, []);

  useEffect(() => {
    setRegLoading(true);
    getRegistrationStatus()
      .then((res) => setRegistrationOpen(Boolean(res.data?.data?.registrationOpen)))
      .catch(() => {})
      .finally(() => setRegLoading(false));
  }, []);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => {
        const data = res.data.data;
        setStats({
          studentCount: data.studentCount,
          mentorCount: data.mentorCount,
          batchCount: data.batchCount,
          attendanceRate: data.attendanceRate,
          gradedSubmissions: data.gradedSubmissions,
        });
        if (data.recentActivity) {
          setUsers(
            data.recentActivity.map((a, i) => ({
              id: a._id || i,
              name: a.student?.name || "Unknown",
              email: "",
              role: "Student",
              batch: a.assignment?.title || "",
            })),
          );
        }
        setIsLive(true);
      })
      .catch(() => {
        // Backend not ready yet or request failed — silently keep fallback data
        setIsLive(false);
      });
  }, []);

  const STATS = [
    { label: "Students", value: stats.studentCount, icon: GraduationCap },
    { label: "Mentors", value: stats.mentorCount, icon: Users },
    { label: "Batches", value: stats.batchCount, icon: Layers },
    {
      label: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
      icon: CalendarCheck,
    },
    {
      label: "Assignments Graded",
      value: stats.gradedSubmissions,
      icon: ClipboardList,
    },
  ];

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)]"
        >
          Admin Dashboard
        </motion.h1>
        {!isLive && (
          <span className="text-xs px-2 py-1 rounded-full bg-warning/15 text-warning">
            Sample Data
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="flex gap-2 mb-6 glass-card rounded-lg p-1.5 w-fit">
        <TabButton
          active={tab === "overview"}
          onClick={() => setTab("overview")}
        >
          Users & Batches
        </TabButton>
        <TabButton
          active={tab === "announce"}
          onClick={() => setTab("announce")}
        >
          Announcements
        </TabButton>
      </div>

      {tab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card glow-border rounded-xl p-5">
            <h2 className="text-text-primary font-semibold mb-4">Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-secondary text-left border-b border-border">
                    <th className="py-2 font-medium">Name</th>
                    <th className="py-2 font-medium">Role</th>
                    <th className="py-2 font-medium">Batch</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-2.5 text-text-primary">{u.name}</td>
                      <td className="py-2.5">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            u.role === "Mentor"
                              ? "bg-emerald/15 text-emerald"
                              : "bg-gold/15 text-gold"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-2.5 text-text-secondary">{u.batch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card glow-border rounded-xl p-5">
            <h2 className="text-text-primary font-semibold mb-4">Batches</h2>
            <div className="space-y-3">
              {batches.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between border-b border-border/50 last:border-0 pb-3 last:pb-0"
                >
                  <div>
                    <p className="text-text-primary text-sm font-medium">
                      {b.name}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {b.students} students
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      b.status === "Active"
                        ? "bg-emerald/15 text-emerald"
                        : "bg-text-secondary/15 text-text-secondary"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card glow-border rounded-xl p-5">
            <h2 className="text-text-primary font-semibold mb-4">Registration Management</h2>
            <div>
              <p className="text-text-secondary mb-3">
                Current Status:{' '}
                {regLoading ? (
                  'Loading...'
                ) : registrationOpen ? (
                  <span className="text-emerald">🟢 Registration is Open</span>
                ) : (
                  <span className="text-danger">🔴 Registration is Closed</span>
                )}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={regLoading || registrationOpen}
                  onClick={() => {
                    setRegLoading(true);
                    updateRegistrationStatus({ registrationOpen: true })
                      .then((res) => setRegistrationOpen(Boolean(res.data?.data?.registrationOpen)))
                      .catch((err) => console.error('Failed to open registration', err))
                      .finally(() => setRegLoading(false));
                  }}
                  className="px-3 py-2 rounded bg-emerald text-obsidian disabled:opacity-60"
                >
                  Open Registration
                </button>

                <button
                  disabled={regLoading || !registrationOpen}
                  onClick={() => {
                    setRegLoading(true);
                    updateRegistrationStatus({ registrationOpen: false })
                      .then((res) => setRegistrationOpen(Boolean(res.data?.data?.registrationOpen)))
                      .catch((err) => console.error('Failed to close registration', err))
                      .finally(() => setRegLoading(false));
                  }}
                  className="px-3 py-2 rounded bg-danger text-white disabled:opacity-60"
                >
                  Close Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "announce" && (
        <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
          <AnnouncementForm
            mode="create"
            onSuccess={(created) =>
              setRecentAnnouncements((current) =>
                [created, ...current].slice(0, 5),
              )
            }
          />

          <div className="glass-card glow-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-text-primary font-semibold">
                Recent Announcements
              </h2>
              <Link
                to="/admin/announcements"
                className="text-xs text-gold hover:underline shrink-0"
              >
                Manage all →
              </Link>
            </div>

            {announcementsError && (
              <p className="text-danger text-sm mb-3">
                {announcementsError}
              </p>
            )}

            {loadingAnnouncements && <Loader />}

            {!loadingAnnouncements &&
              recentAnnouncements.length === 0 &&
              !announcementsError && (
                <EmptyState message="No announcements yet" icon="📢" />
              )}

            {!loadingAnnouncements && recentAnnouncements.length > 0 && (
              <div className="space-y-3">
                {recentAnnouncements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement._id}
                    announcement={announcement}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
