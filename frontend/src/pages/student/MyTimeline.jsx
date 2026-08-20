import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Award } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

export default function MyTimeline() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/progress', { params: { studentId: user.id } }),
      axiosInstance.get('/submissions', { params: { studentId: user.id } }),
      axiosInstance.get(`/badges/${user.id}`),
    ])
      .then(([progressRes, submissionsRes, badgesRes]) => {
        const progressEvents = progressRes.data.data
          .filter((p) => p.status === 'Completed')
          .map((p) => ({ type: 'progress', date: p.updatedAt, label: `Completed ${p.topic}`, icon: CheckCircle }));

        const submissionEvents = submissionsRes.data.data.map((s) => ({
          type: 'submission', date: s.submittedAt || s.createdAt,
          label: `Submitted an assignment${s.score != null ? ` — scored ${s.score}` : ''}`, icon: FileText,
        }));

        const badgeEvents = badgesRes.data.data.map((b) => ({
          type: 'badge', date: b.awardedAt, label: `Earned "${b.title}" badge`, icon: Award,
        }));

        const combined = [...progressEvents, ...submissionEvents, ...badgeEvents]
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setEvents(combined);
      })
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-24 md:pb-12 max-w-2xl mx-auto">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">
        My Timeline
      </motion.h1>

      {!loading && events.length === 0 && (
        <div className="glass-card glow-border rounded-xl p-8 text-center text-text-secondary">
          Your journey starts here — complete topics, submit assignments, and earn badges to build your timeline.
        </div>
      )}

      {events.length > 0 && (
        <div className="relative pl-6 border-l-2 border-border/40 space-y-6">
          {events.map((e, i) => {
            const Icon = e.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }} className="relative">
                <div className="absolute -left-[31px] w-6 h-6 rounded-full glass-card glow-border flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-gold" />
                </div>
                <div className="glass-card glow-border rounded-lg p-3">
                  <p className="text-text-primary text-sm">{e.label}</p>
                  <p className="text-text-secondary text-xs mt-1">{new Date(e.date).toLocaleDateString()}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
