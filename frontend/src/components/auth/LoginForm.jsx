import { useState } from "react";
export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Login submit (real API wiring comes once M1 confirms auth is live):",
      form,
    );
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface p-6 rounded-lg border border-border max-w-sm mx-auto"
    >
      <h2 className="text-xl font-semibold text-text-primary mb-4">Login</h2>
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
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded hover:opacity-90"
      >
        Login
      </button>
    </form>
  );
}
