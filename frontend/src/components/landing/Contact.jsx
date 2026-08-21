import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend endpoint for contact messages yet — this is a UI-only form for now.
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 px-6 max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl font-bold text-text-primary text-center mb-12"
      >
        Get in Touch
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 text-text-secondary">
            <Mail className="w-5 h-5 text-gold" />
            <span>msj-bootcamp@astu.edu.et</span>
          </div>
          <div className="flex items-center gap-3 text-text-secondary">
            <MapPin className="w-5 h-5 text-gold" />
            <span>ASTU Campus, Adama, Ethiopia</span>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card glow-border rounded-xl p-6 space-y-3"
        >
          {sent && (
            <p className="text-emerald text-sm">
              Thanks — we'll get back to you soon!
            </p>
          )}
          <input
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 rounded border border-border bg-background text-text-primary text-sm"
          />
          <input
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 rounded border border-border bg-background text-text-primary text-sm"
          />
          <textarea
            placeholder="Your Message"
            rows={3}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full p-2 rounded border border-border bg-background text-text-primary text-sm"
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald"
          >
            <Send className="w-4 h-4" /> Send Message
          </button>
        </motion.form>
      </div>
    </section>
  );
}
