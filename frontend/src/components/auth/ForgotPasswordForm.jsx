import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../api/auth.api";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-card glow-border rounded-lg p-6 max-w-sm mx-auto text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Check your email
        </h2>
        <p className="text-sm text-text-secondary">
          If an account exists for <strong>{email}</strong>, a password reset
          link has been sent. It expires in 30 minutes.
        </p>
        <Link
          to="/login"
          className="inline-block mt-4 text-sm text-gold hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card glow-border rounded-lg p-6 max-w-sm mx-auto"
    >
      <h2 className="text-xl font-semibold text-text-primary mb-2">
        Forgot password
      </h2>
      <p className="text-sm text-text-secondary mb-4">
        Enter your email and we'll send you a link to reset your password.
      </p>

      {error && <p className="text-danger text-sm mb-3">{error}</p>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
        className="w-full p-2 mb-4 rounded border border-border bg-background text-text-primary"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
