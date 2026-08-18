import { motion } from 'framer-motion';
import { CalendarClock, Megaphone } from 'lucide-react';
import AttendanceRing from '../../components/common/AttendanceRing';

const TOPICS = [
  { name: 'HTML / CSS', progress: 100 },
  { name: 'JavaScript', progress: 90 },
  { name: 'React', progress: 65 },
  { name: 'Node.js / Express', progress: 40 },
  { name: 'MongoDB', progress: 20 },
];

const DEADLINES = [
  { title: 'React Todo App', due: 'Due in 2 days' },
  { title: 'Express REST API', due: 'Due in 5 days' },
];

const ANNOUNCEMENTS = [
  { title: 'Guest talk: Building at scale', time: '1 day ago' },
  { title: 'Batch 4 demo day moved to Friday', time: '3 days ago' },
];

export default function StudentDashboard() {
  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-text-primary font-[var(--font-display)] mb-6"
      >
        My Dashboard
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass-card glow-border arch-top rounded-xl p-6 flex flex-col items-center justify-center">
          <AttendanceRing percentage={94} />
        </div>

        <div className="glass-card glow-border rounded-xl p-5 lg:col-span-2">
          <h2 className="text-text-primary font-semibold mb-4">Topic Progress</h2>
          <div className="space-y-3">
            {TOPICS.map((t) => (
              <div key={t.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-primary">{t.name}</span>
                  <span className="text-text-secondary">{t.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-border/40 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${t.progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
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
            {DEADLINES.map((d) => (
              <div key={d.title} className="flex justify-between items-center border-b border-border/50 last:border-0 pb-3 last:pb-0">
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
            {ANNOUNCEMENTS.map((a) => (
              <div key={a.title} className="border-b border-border/50 last:border-0 pb-3 last:pb-0">
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
