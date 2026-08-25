import { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import RotateOnceLogo from "../common/RotateOnceLogo";
export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(form);

      login(res.data.data.user, res.data.data.token);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card glow-border rounded-lg p-6 max-w-sm mx-auto"
    >
      <div className="flex justify-center mb-4">
        <RotateOnceLogo />
      </div>

      <h2 className="text-xl font-semibold text-text-primary mb-4 text-center">
        Login
      </h2>
      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        autoComplete="email"
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        autoComplete="current-password"
        className="w-full p-2 mb-4 rounded border border-border bg-background text-text-primary"
      />

      <div className="text-right mb-4">
        <Link to="/forgot-password" className="text-sm text-gold hover:underline">
          Forgot password?
        </Link>
      </div>
      
      <button
        type="submit"
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-shadow"
      >
        Login
      </button>
    </form>
  );
}
