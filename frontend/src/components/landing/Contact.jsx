import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Send,
  ArrowUpRight,
  Sparkles,
  Snowflake,
} from "lucide-react";

const particles = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${8 + ((i * 37) % 84)}%`,
  top: `${10 + ((i * 53) % 78)}%`,
  size: 2 + (i % 3),
  duration: 4 + (i % 4),
  delay: (i % 5) * 0.5,
}));

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSent(true);

    setForm({
      name: "",
      email: "",
      message: "",
    });

    setTimeout(() => {
      setSent(false);
    }, 5000);
  };

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden px-4 py-24 sm:px-6 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 35, 0],
            y: [0, -25, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-cyan-400/[0.06] blur-[110px] dark:bg-cyan-300/[0.07]"
        />

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[5%] right-[5%] h-80 w-80 rounded-full bg-emerald/[0.06] blur-[120px] dark:bg-emerald/[0.07]"
        />

        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100,100,100,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100,100,100,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "55px 55px",
          }}
        />

        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.25, 0],
              y: [0, -35, -70],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.25)] dark:bg-white dark:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto mb-14 max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-5 flex justify-center"
        >
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface/70 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
            <Snowflake className="relative z-10 h-5 w-5 text-cyan-500 dark:text-cyan-100/80" />

            <div className="absolute inset-0 rounded-2xl bg-cyan-400/[0.08] blur-xl dark:bg-cyan-100/[0.06]" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-gold"
        >
          Connect With Us
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="text-3xl font-black tracking-tight text-text-primary sm:text-4xl"
        >
          Let&apos;s Build Something{" "}
          <span className="bg-gradient-to-r from-gold via-text-primary to-emerald bg-clip-text text-transparent">
            Remarkable.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-4 max-w-xl text-sm leading-6 text-text-secondary sm:text-base"
        >
          Have a question, idea, or need support? Reach out to the ASTU MSJ
          Summer Bootcamp team. We&apos;re here to help you move forward.
        </motion.p>
      </div>

      <div className="relative mx-auto grid max-w-5xl gap-7 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-surface/70 p-7 shadow-xl backdrop-blur-2xl sm:p-8 dark:border-white/10 dark:bg-white/[0.035] dark:shadow-[0_25px_80px_rgba(0,0,0,0.28)]"
        >
          <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-cyan-400/[0.05] blur-[80px]" />

          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent dark:via-white/30" />

          <div className="relative z-10">
            <div className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />

                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-secondary">
                  Contact Information
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-text-primary">
                We&apos;d love to hear from you.
              </h3>

              <p className="mt-3 text-sm leading-6 text-text-secondary">
                Whether you&apos;re a student, mentor, or collaborator, your
                message matters.
              </p>
            </div>

            <div className="space-y-4">
              <motion.a
                href="mailto:msj-bootcamp@astu.edu.et"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-background/50 p-4 transition-all duration-300 hover:border-gold/30 hover:bg-surface dark:border-white/[0.08] dark:bg-white/[0.025] dark:hover:bg-white/[0.05]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
                  <Mail className="h-5 w-5 text-gold" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                    Email
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold text-text-primary">
                    msj-bootcamp@astu.edu.et
                  </p>
                </div>

                <ArrowUpRight className="h-4 w-4 text-text-secondary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
              </motion.a>

              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-background/50 p-4 transition-all duration-300 hover:border-emerald/30 hover:bg-surface dark:border-white/[0.08] dark:bg-white/[0.025] dark:hover:bg-white/[0.05]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald/20 bg-emerald/10">
                  <MapPin className="h-5 w-5 text-emerald" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-text-primary">
                    ASTU Campus, Adama, Ethiopia
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 border-l border-gold/40 pl-4">
              <p className="text-xs italic leading-5 text-text-secondary">
                &quot;Every great engineering journey begins with a
                question.&quot;
              </p>
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-surface/80 p-6 shadow-xl backdrop-blur-2xl sm:p-8 dark:border-white/10 dark:bg-white/[0.055] dark:shadow-[0_25px_90px_rgba(0,0,0,0.35)]"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/[0.05] blur-[90px]" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-gold/[0.04] blur-[90px]" />

          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent dark:via-cyan-100/30" />

          <div className="relative z-10">
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-100/50">
                Send a Message
              </p>

              <h3 className="mt-2 text-2xl font-black text-text-primary">
                Start a conversation.
              </h3>
            </div>

            {sent && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-5 rounded-xl border border-emerald/20 bg-emerald/10 px-4 py-3 text-xs font-semibold text-emerald"
              >
                ✓ Message received. We&apos;ll get back to you soon.
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary"
                >
                  Your Name
                </label>

                <input
                  id="contact-name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused("")}
                  required
                  className={`w-full rounded-xl border bg-background px-4 py-3 text-sm font-medium text-text-primary outline-none placeholder:text-text-secondary/50 transition-all duration-300 ${
                    focused === "name"
                      ? "border-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.08)]"
                      : "border-border"
                  }`}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary"
                >
                  Email Address
                </label>

                <input
                  id="contact-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  required
                  className={`w-full rounded-xl border bg-background px-4 py-3 text-sm font-medium text-text-primary outline-none placeholder:text-text-secondary/50 transition-all duration-300 ${
                    focused === "email"
                      ? "border-emerald/50 shadow-[0_0_20px_rgba(16,185,129,0.08)]"
                      : "border-border"
                  }`}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary"
                >
                  Message
                </label>

                <textarea
                  id="contact-message"
                  placeholder="Tell us how we can help..."
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused("")}
                  required
                  className={`w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm font-medium leading-6 text-text-primary outline-none placeholder:text-text-secondary/50 transition-all duration-300 ${
                    focused === "message"
                      ? "border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.06)]"
                      : "border-border"
                  }`}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-gold via-[#e6c75a] to-emerald py-3 text-sm font-black tracking-wide text-obsidian shadow-[0_10px_35px_rgba(212,175,55,0.14)] transition-all duration-300 hover:shadow-[0_15px_45px_rgba(212,175,55,0.22)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <Send className="relative z-10 h-4 w-4" />

                <span className="relative z-10">Send Message</span>
              </motion.button>
            </div>
          </div>
        </motion.form>
      </div>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="mx-auto mt-16 h-px max-w-3xl origin-center bg-gradient-to-r from-transparent via-border to-transparent dark:via-white/10"
      />
    </section>
  );
}
