import { useState } from "react";
import { submitApplication } from "../../api/application.api";

const initialForm = {
  name: "",
  email: "",
  academicYear: "",
  department: "",
  gender: "",
  phoneNumber: "",
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

    // Clear messages when user starts editing again
    if (error) setError("");
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

      setForm(initialForm);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Application submission failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-border bg-background text-text-primary placeholder:text-text-secondary/60 outline-none transition-all duration-200 focus:border-gold focus:ring-2 focus:ring-gold/20";

  const labelClass =
    "block text-sm font-medium text-text-primary mb-1.5";

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="glass-card glow-border rounded-2xl p-6 sm:p-8 lg:p-10"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-emerald/20 border border-gold/20 mb-4">
            <span className="text-2xl">◆</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Apply to the Bootcamp
          </h2>

          <p className="text-sm text-text-secondary mt-2 max-w-xl mx-auto leading-relaxed">
            Take the next step in your development journey. Complete the
            application below with accurate information.
          </p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="h-px w-10 bg-border" />
            <span className="text-xs text-text-secondary">
              Application Form
            </span>
            <span className="h-px w-10 bg-border" />
          </div>
        </div>

        {/* Important information */}
        <div className="mb-6 rounded-xl border border-gold/20 bg-gold/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
              !
            </div>

            <div>
              <p className="text-sm font-semibold text-text-primary">
                Before you apply
              </p>

              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                This is an application, not an account registration. Your
                application will be reviewed by the bootcamp team and you will
                be contacted by email.
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-danger/30 bg-danger/10 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center text-danger font-bold">
                !
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-danger">
                  Application Error
                </p>

                <p className="text-sm text-text-secondary mt-1">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald/30 bg-emerald/10 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald font-bold">
                ✓
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald">
                  Application Submitted
                </p>

                <p className="text-sm text-text-secondary mt-1">
                  {success}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSuccess("")}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Personal Information */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center text-gold font-semibold">
              01
            </div>

            <div>
              <h3 className="text-base font-semibold text-text-primary">
                Personal Information
              </h3>

              <p className="text-xs text-text-secondary mt-0.5">
                Tell us a little about yourself.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className={labelClass}>
                Full Name <span className="text-danger">*</span>
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address <span className="text-danger">*</span>
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className={inputClass}
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phoneNumber" className={labelClass}>
                Phone Number <span className="text-danger">*</span>
              </label>

              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                placeholder="+251 9XX XXX XXX"
                value={form.phoneNumber}
                onChange={handleChange}
                autoComplete="tel"
                required
                className={inputClass}
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className={labelClass}>
                Gender <span className="text-danger">*</span>
              </label>

              <input
                id="gender"
                type="text"
                name="gender"
                placeholder="Enter your gender"
                value={form.gender}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald font-semibold">
              02
            </div>

            <div>
              <h3 className="text-base font-semibold text-text-primary">
                Academic Information
              </h3>

              <p className="text-xs text-text-secondary mt-0.5">
                Provide your current academic details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Academic Year */}
            <div>
              <label htmlFor="academicYear" className={labelClass}>
                Academic Year <span className="text-danger">*</span>
              </label>

              <input
                id="academicYear"
                type="text"
                name="academicYear"
                placeholder="e.g. 3rd year"
                value={form.academicYear}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className={labelClass}>
                Department <span className="text-danger">*</span>
              </label>

              <input
                id="department"
                type="text"
                name="department"
                placeholder="e.g. Software Engineering"
                value={form.department}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* Daily commitment */}
            <div className="sm:col-span-2">
              <label
                htmlFor="dailyCommitmentHours"
                className={labelClass}
              >
                Daily Time Commitment{" "}
                <span className="text-danger">*</span>
              </label>

              <div className="relative">
                <input
                  id="dailyCommitmentHours"
                  type="number"
                  name="dailyCommitmentHours"
                  placeholder="Minimum 5 hours"
                  value={form.dailyCommitmentHours}
                  onChange={handleChange}
                  min={5}
                  step="0.5"
                  required
                  className={`${inputClass} pr-20`}
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-secondary">
                  hrs/day
                </span>
              </div>

              <p className="text-xs text-text-secondary mt-1.5">
                Minimum commitment: 5 hours per day.
              </p>
            </div>
          </div>
        </div>

        {/* Motivation */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center text-gold font-semibold">
              03
            </div>

            <div>
              <h3 className="text-base font-semibold text-text-primary">
                Motivation
              </h3>

              <p className="text-xs text-text-secondary mt-0.5">
                Help us understand why you want to join.
              </p>
            </div>
          </div>

          <label htmlFor="motivation" className={labelClass}>
            Why do you want to join the bootcamp?{" "}
            <span className="text-danger">*</span>
          </label>

          <textarea
            id="motivation"
            name="motivation"
            placeholder="Explain in detail why you want to join the bootcamp, what you hope to learn, and what you can contribute..."
            value={form.motivation}
            onChange={handleChange}
            required
            rows={6}
            className={`${inputClass} resize-none leading-relaxed`}
          />

          <div className="mt-2 rounded-lg bg-background/50 border border-border p-3">
            <p className="text-xs text-text-secondary leading-relaxed">
              <span className="font-semibold text-gold">
                Important:
              </span>{" "}
              Please write your motivation yourself. Do not use AI to
              generate your response. Applications containing AI-generated
              motivation may not be eligible.
            </p>
          </div>
        </div>

        {/* Optional Profiles */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald font-semibold">
              04
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-text-primary">
                  Coding Profiles
                </h3>

                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-background border border-border text-text-secondary">
                  Optional
                </span>
              </div>

              <p className="text-xs text-text-secondary mt-0.5">
                Share your profiles so we can learn more about your work.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Codeforces */}
            <div>
              <label
                htmlFor="codeforcesHandle"
                className={labelClass}
              >
                Codeforces Handle
              </label>

              <input
                id="codeforcesHandle"
                type="text"
                name="codeforcesHandle"
                placeholder="Your Codeforces username"
                value={form.codeforcesHandle}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* LeetCode */}
            <div>
              <label
                htmlFor="leetcodeHandle"
                className={labelClass}
              >
                LeetCode Handle
              </label>

              <input
                id="leetcodeHandle"
                type="text"
                name="leetcodeHandle"
                placeholder="Your LeetCode username"
                value={form.leetcodeHandle}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* GitHub */}
            <div>
              <label htmlFor="githubUrl" className={labelClass}>
                GitHub Profile
              </label>

              <input
                id="githubUrl"
                type="url"
                name="githubUrl"
                placeholder="https://github.com/username"
                value={form.githubUrl}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                Submitting Application...
              </span>
            ) : (
              "Submit Application"
            )}
          </button>

          <p className="text-center text-xs text-text-secondary mt-3">
            By submitting this application, you confirm that the information
            provided is accurate.
          </p>
        </div>
      </form>
    </div>
  );
}