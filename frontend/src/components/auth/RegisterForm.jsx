import { useState } from "react";
import { registerUser } from "../../api/auth.api";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await registerUser(form);
      setSuccess(res.data.message || "Registration submitted!");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card glow-border rounded-lg p-6 max-w-sm mx-auto"
    >
      <h2 className="text-xl font-semibold text-text-primary mb-4">Register</h2>
      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      {success && <p className="text-emerald text-sm mb-3">{success}</p>}

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        autoComplete="name"
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
      />
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
        autoComplete="new-password"
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full p-2 mb-4 rounded border border-border bg-background text-text-primary"
      >
        <option value="student">Student</option>
        <option value="mentor">Mentor</option>
      </select>

      <button
        type="submit"
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-shadow"
      >
        Register
      </button>
    </form>
  );
}
