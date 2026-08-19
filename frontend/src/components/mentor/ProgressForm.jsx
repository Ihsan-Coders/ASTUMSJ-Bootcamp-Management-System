import { useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../api/axiosInstance';

export default function ProgressForm({
  studentId,
  batchId,
  onUpdated,
}) {
  const [topic, setTopic] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Submit student progress to the backend.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId || !batchId || !topic.trim()) {
      setMessage('Please complete all required fields.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      await axiosInstance.post('/progress', {
        student: studentId,
        batch: batchId,
        topic: topic.trim(),
        progress: Number(progress),
      });

      setMessage('Progress updated successfully.');

      setTopic('');
      setProgress(0);

      onUpdated?.();
    } catch (error) {
      console.error('Failed to update progress:', error);

      setMessage(
        error?.response?.data?.message ||
          'Failed to update progress.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        relative
        overflow-hidden
        rounded-2xl
        border border-[#D4AF37]/30
        bg-[rgba(10,35,26,0.75)]
        p-6
        backdrop-blur-[16px]
      "
    >
      <div className="
        absolute
        top-0
        left-0
        right-0
        h-px
        bg-gradient-to-r
        from-transparent
        via-[#D4AF37]
        to-transparent
      " />

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
        Update Progress
      </h2>

      <div className="mt-6 space-y-5">

        <div>
          <label className="
            mb-2
            block
            text-sm
            font-medium
            text-[#F8F9FA]/70
          ">
            Topic
          </label>

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Example: React Hooks"
            className="
              w-full
              rounded-xl
              border border-[#F8F9FA]/10
              bg-[#051C14]
              px-4 py-3
              text-sm
              text-[#F8F9FA]
              outline-none
              placeholder:text-[#F8F9FA]/30
              transition
              focus:border-[#D4AF37]/50
              focus:ring-2
              focus:ring-[#D4AF37]/10
            "
          />
        </div>

        <div>
          <div className="
            mb-3
            flex
            justify-between
          ">
            <label className="
              text-sm
              text-[#F8F9FA]/70
            ">
              Completion
            </label>

            <span className="
              font-semibold
              text-[#D4AF37]
            ">
              {progress}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) =>
              setProgress(Number(e.target.value))
            }
            className="
              h-2
              w-full
              cursor-pointer
              appearance-none
              rounded-full
              bg-[#0A0F0D]
              accent-[#10B981]
            "
          />

          <div className="
            mt-3
            h-2
            overflow-hidden
            rounded-full
            bg-[#0A0F0D]
          ">
            <motion.div
              animate={{
                width: `${progress}%`,
              }}
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-[#D4AF37]
                to-[#10B981]
              "
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="
            w-full
            rounded-xl
            bg-gradient-to-r
            from-[#D4AF37]
            to-[#10B981]
            px-5 py-3
            text-sm
            font-bold
            text-[#0A0F0D]
            transition-all
            hover:-translate-y-0.5
            hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? 'Updating...' : 'Update Progress'}
        </button>

        {message && (
          <p
            className={`text-sm ${
              message.includes('successfully')
                ? 'text-[#10B981]'
                : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}

      </div>
    </motion.form>
  );
}