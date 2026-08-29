import { motion } from "framer-motion";

const FEATURES = [
  {
    number: "01",
    title: "Learn",
    description:
      "Build strong technical foundations through structured, hands-on learning.",
  },
  {
    number: "02",
    title: "Build",
    description:
      "Turn your knowledge into real projects that solve practical problems.",
  },
  {
    number: "03",
    title: "Grow",
    description:
      "Learn from mentors, collaborate with peers, and develop skills for your future career.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-gold/10 bg-white/[0.02] px-6 py-12 sm:px-10 sm:py-16 md:px-16"
        >
          <div
            aria-hidden="true"
            className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-gold/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-emerald/10 blur-3xl"
          />

          <div className="relative z-10 text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-gold"
            >
              <span className="w-8 h-px bg-gold/50" />
              About the Program
              <span className="w-8 h-px bg-gold/50" />
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-text-primary"
            >
              Where{" "}
              <span className="bg-gradient-to-r from-gold to-emerald bg-clip-text text-transparent">
                ambition
              </span>{" "}
              becomes{" "}
              <span className="bg-gradient-to-r from-emerald to-gold bg-clip-text text-transparent">
                ability.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-6 max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-text-secondary leading-8"
            >
              The{" "}
              <span className="text-text-primary font-medium">
                ASTU MSJ Summer Bootcamp
              </span>{" "}
              is an intensive learning experience designed to transform students
              into confident, practical software developers. Through structured
              tracks, hands-on projects, mentorship, and collaboration,
              participants gain the skills needed to move from learning concepts
              to building real-world solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left"
            >
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.number}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="group rounded-2xl border border-gold/10 bg-black/10 p-6 hover:border-gold/25 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest text-gold/60">
                      {feature.number}
                    </span>

                    <span className="h-px w-10 bg-gold/20 group-hover:w-16 transition-all duration-300" />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-text-primary">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm text-text-secondary leading-6">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
