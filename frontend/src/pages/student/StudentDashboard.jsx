import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarClock, Megaphone } from "lucide-react";
import AttendanceRing from "../../components/common/AttendanceRing";
import { getStudentDashboard } from "../../api/dashboard.api";

const FALLBACK_TOPICS = [
  { name: "HTML / CSS", progress: 100 },
  { name: "JavaScript", progress: 90 },
  { name: "React", progress: 65 },
  { name: "Node.js / Express", progress: 40 },
  { name: "MongoDB", progress: 20 },
];

const FALLBACK_DEADLINES = [
  { title: "React Todo App", due: "Due in 2 days" },
  { title: "Express REST API", due: "Due in 5 days" },
];

const FALLBACK_ANNOUNCEMENTS = [
  { title: "Guest talk: Building at scale", time: "1 day ago" },
  { title: "Batch 4 demo day moved to Friday", time: "3 days ago" },
];

export default function StudentDashboard() {
  const [attendance, setAttendance] = useState(94);
  const [deadlines, setDeadlines] = useState(FALLBACK_DEADLINES);
  const [announcements, setAnnouncements] = useState(FALLBACK_ANNOUNCEMENTS);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    getStudentDashboard()
      .then((res) => {
        const data = res.data.data;
        setAttendance(data.attendancePercentage ?? 94);

        if (data.upcomingDeadlines) {
          setDeadlines(
            data.upcomingDeadlines.map((e) => ({
              title: e.title,
              due: new Date(e.date).toLocaleDateString(),
            })),
          );
        }

        if (data.recentAnnouncements) {
          setAnnouncements(
            data.recentAnnouncements.map((a) => ({
              title: a.title,
              time: new Date(a.publishDate).toLocaleDateString(),
            })),
          );
        }
        setIsLive(true);
      })
      .catch(() => setIsLive(false));
  }, []);

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass-card glow-border arch-top rounded-xl p-6 flex flex-col items-center justify-center">
          <AttendanceRing percentage={attendance} />
        </div>

        <div className="glass-card glow-border rounded-xl p-5 lg:col-span-2">
          <h2 className="text-text-primary font-semibold mb-4">
            Topic Progress
          </h2>
          <div className="space-y-3">
            {FALLBACK_TOPICS.map((t) => (
              <div key={t.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-primary">{t.name}</span>
                  <span className="text-text-secondary">{t.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-border/40 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${t.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-gold to-emerald"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="glass-card glow-border rounded-xl p-5">
          <h2 className="text-text-primary font-semibold mb-4 flex items-center gap-2">
            <CalendarClock size={18} className="text-gold" /> Upcoming Deadlines
          </h2>
          <div className="space-y-3">
            {deadlines.map((d) => (
              <div
                key={d.title}
                className="flex justify-between items-center border-b border-border/50 last:border-0 pb-3 last:pb-0"
              >
                <span className="text-text-primary text-sm">{d.title}</span>
                <span className="text-xs text-gold">{d.due}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card glow-border rounded-xl p-5">
          <h2 className="text-text-primary font-semibold mb-4 flex items-center gap-2">
            <Megaphone size={18} className="text-gold" /> Announcements
          </h2>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div
                key={a.title}
                className="border-b border-border/50 last:border-0 pb-3 last:pb-0"
              >
                <p className="text-text-primary text-sm">{a.title}</p>
                <p className="text-text-secondary text-xs mt-0.5">{a.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
