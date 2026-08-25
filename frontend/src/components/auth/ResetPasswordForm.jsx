import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { resetPassword } from "../../api/auth.api";

export default function ResetPasswordForm() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, form.password);
      
      navigate("/login", {
        state: { message: "Password reset — please log in." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "This reset link is invalid or has expired."
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
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Reset password
      </h2>

      {error && (
        <div className="mb-3">
          <p className="text-danger text-sm">{error}</p>
          {error.toLowerCase().includes("invalid or") && (
            <Link to="/forgot-password" className="text-sm text-gold hover:underline">
              Request a new link
            </Link>
          )}
        </div>
      )}

      <input
        type="password"
        name="password"
        placeholder="New password"
        value={form.password}
        onChange={handleChange}
        autoComplete="new-password"
        required
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
      />
      <p className="text-xs text-text-secondary mb-3 -mt-2">
        At least 8 characters, with uppercase, lowercase, a number, and a special character.
      </p>

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm new password"
        value={form.confirmPassword}
        onChange={handleChange}
        autoComplete="new-password"
        required
        className="w-full p-2 mb-4 rounded border border-border bg-background text-text-primary"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Resetting..." : "Reset password"}
      </button>
    </form>
  );
}
