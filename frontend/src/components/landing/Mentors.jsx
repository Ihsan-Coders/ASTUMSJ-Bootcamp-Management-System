import { motion } from "framer-motion";

const MENTORS = [
  {
    name: "Nahom Girma",
    role: "Backend Mentor",
    focus: "Node.js · Express · MongoDB",
  },
  {
    name: "Bethelhem Assefa",
    role: "Frontend Mentor",
    focus: "React · Tailwind CSS",
  },
  {
    name: "Dawit Alemu",
    role: "Full Stack Mentor",
    focus: "MERN Stack Architecture",
  },
];

export default function Mentors() {
  return (
    <section id="mentors" className="py-20 px-6 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl font-bold text-text-primary text-center mb-12"
      >
        Meet Our Mentors
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6">
        {MENTORS.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass-card glow-border rounded-xl p-6 text-center"
          >
            <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-gold to-emerald flex items-center justify-center text-obsidian font-bold text-lg">
              {m.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <h3 className="text-text-primary font-semibold">{m.name}</h3>
            <p className="text-gold text-sm mt-1">{m.role}</p>
            <p className="text-text-secondary text-xs mt-2">{m.focus}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
