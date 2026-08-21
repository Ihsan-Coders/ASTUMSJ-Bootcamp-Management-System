import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);

      const { user, token } = res.data.data;

      // Save authentication data
      login(user, token);

      // Redirect based on role
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;

        case "mentor":
          navigate("/mentor");
          break;

        case "student":
          navigate("/student");
          break;

        default:
          navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password."
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
        Login
      </h2>

      {error && (
        <p className="text-danger text-sm mb-3">
          {error}
        </p>
      )}

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
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        autoComplete="current-password"
        required
        className="w-full p-2 mb-4 rounded border border-border bg-background text-text-primary"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}