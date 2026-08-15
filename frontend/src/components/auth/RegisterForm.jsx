import { useState } from "react";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register submit (real API wiring comes next):", form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface p-6 rounded-lg border border-border max-w-sm mx-auto"
    >
      <h2 className="text-xl font-semibold text-text-primary mb-4">Register</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-2 mb-3 rounded border border-border bg-background text-text-primary"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
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
        className="w-full bg-primary text-white py-2 rounded hover:opacity-90"
      >
        Register
      </button>
    </form>
  );
}
