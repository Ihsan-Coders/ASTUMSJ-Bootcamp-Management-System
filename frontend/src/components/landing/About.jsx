import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-20 px-6 max-w-4xl mx-auto text-center">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl font-bold text-text-primary mb-6"
      >
        About the Bootcamp
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-text-secondary leading-relaxed"
      >
        The ASTU MSJ Summer Bootcamp is an intensive program designed to give
        students hands-on, real-world software development experience. Over the
        course of the program, participants work through structured tracks,
        receive mentorship from experienced developers, and build real projects
        — all while being supported by a centralized platform that tracks
        attendance, progress, and growth every step of the way.
      </motion.p>
    </section>
  );
}
