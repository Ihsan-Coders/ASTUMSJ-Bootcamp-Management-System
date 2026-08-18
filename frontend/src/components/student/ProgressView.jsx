import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../api/axiosInstance';

export default function ProgressView({ studentId }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load student progress from the backend.
  useEffect(() => {
    if (!studentId) return;

    async function loadProgress() {
      try {
        setLoading(true);
        setError('');

        const response = await axiosInstance.get('/progress', {
          params: {
            studentId,
          },
        });

        setTopics(response?.data?.data || []);
      } catch (error) {
        console.error('Failed to load progress:', error);

        setError(
          error?.response?.data?.message ||
          'Could not load progress.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [studentId]);

  if (loading) {
    return (
      <div className="
        rounded-2xl
        border border-[#D4AF37]/20
        bg-[rgba(10,35,26,0.75)]
        p-6
        text-center
        backdrop-blur-[16px]
      ">
        <p className="text-sm text-[#F8F9FA]/60">
          Loading progress...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="
        rounded-2xl
        border border-red-400/20
        bg-[rgba(10,35,26,0.75)]
        p-6
        text-center
        backdrop-blur-[16px]
      ">
        <p className="text-sm text-red-400">
          {error}
        </p>
      </div>
    );
  }

  const averageProgress =
    topics.length > 0
      ? Math.round(
          topics.reduce(
            (total, item) => total + Number(item.progress || 0),
            0
          ) / topics.length
        )
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        relative overflow-hidden
        rounded-2xl
        border border-[#D4AF37]/30
        bg-[rgba(10,35,26,0.75)]
        p-6
        backdrop-blur-[16px]
      "
    >
      <div className="
        absolute top-0 left-0 right-0 h-px
        bg-gradient-to-r
        from-transparent
        via-[#D4AF37]
        to-transparent
      " />

      <div className="
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      ">
        <div>
          <p className="
            text-xs
            uppercase
            tracking-[0.2em]
            text-[#D4AF37]
          ">
            M2 • Progress
          </p>

          <h2 className="
            mt-1
            text-xl
            font-semibold
            text-[#F8F9FA]
          ">
            Topic Progress
          </h2>
        </div>

        <div className="
          rounded-xl
          border border-[#10B981]/30
          bg-[#10B981]/10
          px-4 py-3
          text-center
        ">
          <p className="text-xs text-[#F8F9FA]/50">
            Overall
          </p>

          <p className="
            text-xl
            font-bold
            text-[#10B981]
          ">
            {averageProgress}%
          </p>
        </div>
      </div>

      {topics.length === 0 ? (
        <div className="
          mt-6
          rounded-xl
          border border-[#F8F9FA]/10
          bg-[#051C14]/60
          p-8
          text-center
        ">
          <div className="mb-3 text-3xl">
            ✦
          </div>

          <p className="text-sm text-[#F8F9FA]/60">
            No progress data available yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {topics.map((item, index) => {
            const value = Math.min(
              Math.max(Number(item.progress) || 0, 0),
              100
            );

            return (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="
                    text-sm
                    font-medium
                    text-[#F8F9FA]
                  ">
                    {item.topic}
                  </span>

                  <span className="
                    text-sm
                    font-semibold
                    text-[#D4AF37]
                  ">
                    {value}%
                  </span>
                </div>

                <div className="
                  h-2.5
                  overflow-hidden
                  rounded-full
                  bg-[#0A0F0D]
                ">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.7 }}
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-[#D4AF37]
                      to-[#10B981]
                    "
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}