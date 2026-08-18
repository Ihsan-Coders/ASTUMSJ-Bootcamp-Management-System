import { useEffect, useState } from 'react';
import { getAttendance } from '../../api/attendance.api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function AttendanceView() {
  const { user } = useAuth();

  const [data, setData] = useState({
    records: [],
    percentage: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function loadAttendance() {
      try {
        setLoading(true);

        const res = await getAttendance({
          studentId: user.id,
        });

        setData(res.data.data);
      } catch (error) {
        console.error('Failed to load attendance:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <p className="text-text-secondary text-sm">
          Loading attendance...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card glow-border rounded-2xl p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-display font-semibold text-text-primary">
          My Attendance
        </h2>

        <p className="text-sm text-text-secondary mt-1">
          Your overall bootcamp attendance
        </p>
      </div>

      {/* Percentage */}
      <div className="text-center py-6">
        <div className="text-5xl font-bold text-gold">
          {data.percentage}%
        </div>

        <p className="text-text-secondary text-sm mt-2">
          Attendance Rate
        </p>
      </div>

      {/* Recent Records */}
      {data.records.length > 0 && (
        <div className="border-t border-border pt-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Recent Attendance
          </h3>

          <div className="space-y-2">
            {data.records.slice(0, 5).map((record, index) => (
              <div
                key={record._id || index}
                className="flex items-center justify-between
                           rounded-lg
                           bg-surface-solid
                           border border-border
                           px-4 py-3"
              >
                <span className="text-sm text-text-secondary">
                  {new Date(record.date).toLocaleDateString()}
                </span>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    record.status === 'Present'
                      ? 'text-emerald bg-emerald/10 border border-emerald/30'
                      : record.status === 'Late'
                      ? 'text-warning bg-warning/10 border border-warning/30'
                      : 'text-danger bg-danger/10 border border-danger/30'
                  }`}
                >
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Records */}
      {data.records.length === 0 && (
        <div className="border-t border-border pt-5 text-center">
          <p className="text-sm text-text-secondary">
            No attendance records yet.
          </p>
        </div>
      )}
    </motion.div>
  );
}