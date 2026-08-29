import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }

    try {
      setLoading(true);
      console.log('Contact submit — API base:', axiosInstance.defaults.baseURL);
      const res = await axiosInstance.post("/auth/contact", {
        name: form.name,
        email: form.email,
        message: form.message,
      });
      console.log('Contact response:', res.data);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error('Contact error:', err);
      setError(err?.response?.data?.message || "Failed to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
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
              Thanks — your message has been sent successfully.
            </p>
          )}
          {error && <p className="text-danger text-sm">{error}</p>}
          <input
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 rounded border border-border bg-background text-text-primary text-sm"
          />
          <input
            placeholder="Your Email"
            type="email"
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
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
          >
            <Send className="w-4 h-4" /> {loading ? "Sending..." : "Send Message"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
