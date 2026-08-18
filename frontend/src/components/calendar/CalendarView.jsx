import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../api/axiosInstance';

export default function CalendarView({ batchId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!batchId) return;

    async function loadEvents() {
      try {
        setLoading(true);
        setError('');

        const res = await axiosInstance.get('/calendar', {
          params: { batchId },
        });

        setEvents(res.data.data || []);
      } catch (err) {
        console.error('Failed to load calendar:', err);
        setError('Could not load upcoming events.');
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [batchId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card glow-border rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-display font-semibold text-text-primary">
            Upcoming
          </h3>

          <p className="text-sm text-text-secondary mt-1">
            Important bootcamp dates and events
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
          <span className="text-gold text-lg">📅</span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-8 text-center">
          <p className="text-sm text-text-secondary">
            Loading events...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-center">
          <p className="text-sm text-danger">
            {error}
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && events.length === 0 && (
        <div className="rounded-xl border border-border bg-surface-solid p-6 text-center">
          <div className="text-3xl mb-2">📅</div>

          <p className="text-sm font-medium text-text-primary">
            No upcoming events
          </p>

          <p className="text-xs text-text-secondary mt-1">
            There are no scheduled events for this batch yet.
          </p>
        </div>
      )}

      {/* Events */}
      {!loading && !error && events.length > 0 && (
        <div className="space-y-3">
          {events.map((event, index) => {
            const eventDate = new Date(event.date);

            return (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
                className="group flex items-center gap-4 rounded-xl
                           border border-border
                           bg-surface-solid
                           p-4
                           hover:border-gold/40
                           hover:bg-gold/5
                           transition-all"
              >
                {/* Date badge */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl
                                border border-gold/30
                                bg-gold/10
                                flex flex-col items-center justify-center">
                  <span className="text-xs uppercase text-text-secondary">
                    {eventDate.toLocaleDateString('en-US', {
                      month: 'short',
                    })}
                  </span>

                  <span className="text-xl font-bold text-gold">
                    {eventDate.getDate()}
                  </span>
                </div>

                {/* Event information */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-text-primary truncate">
                    {event.title}
                  </h4>

                  <p className="text-xs text-text-secondary mt-1">
                    {eventDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}