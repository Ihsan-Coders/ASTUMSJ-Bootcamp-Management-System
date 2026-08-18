import { motion } from 'framer-motion';

export default function AttendanceRing({ percentage = 0, size = 140 }) {
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="rgba(212,175,55,0.15)" strokeWidth="10" fill="none"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="url(#ringGradient)" strokeWidth="10" fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-text-primary">{percentage}%</span>
        <span className="text-[11px] text-text-secondary uppercase tracking-wide">Attendance</span>
      </div>
    </div>
  );
}
