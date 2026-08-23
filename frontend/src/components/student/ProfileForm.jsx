import { useState } from "react";
import { updateMe } from "../../api/user.api";
import { useAuth } from "../../context/AuthContext";

export default function ProfileForm({ profile, onUpdated }) {
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await updateMe({
        name: form.name.trim(),
        email: form.email.trim(),
      });
      const updated = res.data.data;

      // Keep the shape consistent with what login()/register() store, so
      // other screens that read user.id / user.role keep working.
      login(
        {
          id: updated._id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
        },
        localStorage.getItem("token"),
      );

      setSuccess("Profile updated successfully.");
      onUpdated?.(updated);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card glow-border rounded-xl p-6 max-w-md"
    >
      <h2 className="text-lg font-semibold text-text-primary mb-4">
        My Profile
      </h2>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      {success && <p className="text-emerald text-sm mb-3">{success}</p>}

      <label className="block text-xs text-text-secondary mb-1">Name</label>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
        placeholder="Name"
        required
      />

      <label className="block text-xs text-text-secondary mb-1">Email</label>
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full p-2 mb-4 rounded border border-border bg-background text-text-primary"
        placeholder="Email"
        required
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
