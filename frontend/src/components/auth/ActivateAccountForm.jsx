import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { activateAccount } from "../../api/auth.api";

export default function ActivateAccountForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const token = searchParams.get("token") || "";

  useEffect(() => {
    if (!token) {
      setError("Missing activation token.");
    }
  }, [token]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Missing activation token.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await activateAccount(token, form.password);
      setSuccess("Account activated successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Activation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card glow-border rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-text-primary mb-4 text-center">Activate Your Account</h2>

      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      {success && <p className="text-emerald text-sm mb-3">{success}</p>}

      <input
        type="password"
        name="password"
        placeholder="New password"
        value={form.password}
        onChange={handleChange}
        autoComplete="new-password"
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        value={form.confirmPassword}
        onChange={handleChange}
        autoComplete="new-password"
        className="w-full p-2 mb-4 rounded border border-border bg-background text-text-primary"
      />

      <button
        type="submit"
        disabled={loading || !token}
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald disabled:opacity-60"
      >
        {loading ? "Activating..." : "Set password & activate account"}
      </button>
    </form>
  );
}
