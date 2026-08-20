import { motion } from "framer-motion";
import { Code2, Server, Layers } from "lucide-react";

const TRACKS = [
  {
    name: "Frontend Development",
    desc: "React, Tailwind CSS, and modern UI patterns — build interfaces that feel alive.",
    icon: Code2,
  },
  {
    name: "Backend Development",
    desc: "Node.js, Express, and REST API design — the engine behind every great product.",
    icon: Server,
  },
  {
    name: "Full Stack (MERN)",
    desc: "End-to-end application development — own a feature from database to browser.",
    icon: Layers,
  },
];

export default function Tracks() {
  return (
    <section id="tracks" className="py-20 px-6 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl font-bold text-text-primary text-center mb-12"
      >
        Our Tracks
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6">
        {TRACKS.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card glow-border rounded-xl p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-emerald/10 border border-gold/30 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-text-primary font-semibold mb-2">{t.name}</h3>
              <p className="text-text-secondary text-sm">{t.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
