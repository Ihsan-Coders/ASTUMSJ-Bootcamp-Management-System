import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card glow-border rounded-2xl p-10"
      >
        <Compass className="w-12 h-12 text-gold mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-text-primary mb-2">404</h1>
        <p className="text-text-secondary mb-6">
          This page doesn't exist — let's get you back on track.
        </p>
        <Link
          to="/"
          className="px-6 py-2 rounded-lg font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald inline-block"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
