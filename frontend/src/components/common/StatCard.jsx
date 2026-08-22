import { motion } from "framer-motion";

export default function StatCard({ label, value, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card glow-border arch-top p-6 text-center"
    >
      {Icon && (
        <div className="mb-2 flex justify-center">
          <Icon className="w-6 h-6 text-gold" />
        </div>
      )}

      <div className="text-3xl font-bold text-gold">{value}</div>

      <div className="text-text-secondary text-sm mt-1">{label}</div>
    </motion.div>
  );
}
