import { useState } from "react";
import { submitApplication } from "../../api/application.api";

const initialForm = {
  name: "",
  email: "",
  academicYear: "",
  department: "",
  gender: "",
  dailyCommitmentHours: "",
  motivation: "",
  codeforcesHandle: "",
  leetcodeHandle: "",
  githubUrl: "",
};

export default function RegisterForm() {
  const [form, setForm] = useState(initialForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await submitApplication({
        ...form,
        dailyCommitmentHours: Number(form.dailyCommitmentHours),
      });

      setSuccess(
        res.data.message ||
          "Application submitted! We'll review it and be in touch."
      );

      // Clear form after successful submission
      setForm(initialForm);
    } catch (err) {
      setError(
        err.response?.data?.message || "Application submission failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card glow-border rounded-lg p-6 max-w-sm mx-auto"
    >
      <h2 className="text-xl font-semibold text-text-primary mb-1">
        Apply to the Bootcamp
      </h2>
      <p className="text-xs text-text-secondary mb-4">
        This is an application, not an account. We'll review it and follow
        up by email.
      </p>

      {error && (
        <p className="text-danger text-sm mb-3">
          {error}
        </p>
      )}

      {success && (
        <p className="text-emerald text-sm mb-3">
          {success}
        </p>
      )}

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        autoComplete="name"
        required
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        autoComplete="email"
        required
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
      />

      <input
        type="text"
        name="academicYear"
        placeholder="Academic Year (e.g. 3rd year)"
        value={form.academicYear}
        onChange={handleChange}
        required
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
      />

      <input
        type="text"
        name="department"
        placeholder="Department"
        value={form.department}
        onChange={handleChange}
        required
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
      />

      <input
        type="text"
        name="gender"
        placeholder="Gender"
        value={form.gender}
        onChange={handleChange}
        required
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
      />

      <input
        type="number"
        name="dailyCommitmentHours"
        placeholder="Daily time commitment (hours, min 5)"
        value={form.dailyCommitmentHours}
        onChange={handleChange}
        min={5}
        step="0.5"
        required
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
      />

      <textarea
        name="motivation"
        placeholder="Why do you want to join the bootcamp? Do not use AI you will not be eligible Explain in detail"
        value={form.motivation}
        onChange={handleChange}
        required
        rows={4}
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary resize-none"
      />

      <p className="text-xs text-text-secondary mb-2">Optional</p>

      <input
        type="text"
        name="codeforcesHandle"
        placeholder="Codeforces handle"
        value={form.codeforcesHandle}
        onChange={handleChange}
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
      />

      <input
        type="text"
        name="leetcodeHandle"
        placeholder="LeetCode handle"
        value={form.leetcodeHandle}
        onChange={handleChange}
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
      />

      <input
        type="url"
        name="githubUrl"
        placeholder="GitHub link"
        value={form.githubUrl}
        onChange={handleChange}
        className="w-full p-2 mb-4 rounded border border-border bg-background text-text-primary"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}