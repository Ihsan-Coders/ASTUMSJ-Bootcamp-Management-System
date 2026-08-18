import { motion } from 'framer-motion';

const STATS = [
  { label: 'Active Batches', value: '4' },
  { label: 'Attendance Rate', value: '94%' },
  { label: 'Assignments Completed', value: '312' },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto
                 grid md:grid-cols-2 gap-10 md:gap-12 items-center"
    >
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-text-primary font-[var(--font-display)]">
          Empowering the Next Generation of{' '}
          <span className="bg-gradient-to-r from-gold to-emerald bg-clip-text text-transparent">
            Engineers
          </span>
        </h1>
        <p className="mt-4 text-text-secondary text-base sm:text-lg max-w-md">
          A centralized platform for the ASTU MSJ Summer Bootcamp — track attendance,
          progress, assignments, and grow together.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button className="px-6 py-3 rounded-lg font-semibold text-obsidian
                             bg-gradient-to-r from-gold to-emerald
                             hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-shadow">
            Explore Dashboard
          </button>
          <button className="px-6 py-3 rounded-lg font-semibold border border-gold/40
                             text-text-primary hover:border-gold transition-colors">
            View Batches
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        {/* Islamic geometric frame accent behind the card */}
        <div
          aria-hidden="true"
          className="absolute -inset-4 rounded-3xl border border-gold/15"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(212,175,55,0.04) 0 2px, transparent 2px 14px)',
          }}
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="glass-card glow-border rounded-2xl p-6 sm:p-8 relative"
        >
          <div className="grid grid-cols-1 gap-5 sm:gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex justify-between items-center border-b border-gold/10 pb-3 last:border-0"
              >
                <span className="text-text-secondary text-sm">{stat.label}</span>
                <span className="text-2xl font-bold text-gold">{stat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
