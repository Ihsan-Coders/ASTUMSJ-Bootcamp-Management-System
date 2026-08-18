import { useState } from "react";
import { createResource } from "../../api/resource.api";

export default function ResourceUploadForm({ onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "Link",
    url: "",
    topic: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createResource(form);
    setForm({ title: "", description: "", type: "Link", url: "", topic: "" }); // clear form after submit
    onCreated?.(); // tells the parent page to refresh its list
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card glow-border rounded-lg p-6 space-y-3"
    >
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full p-2 rounded border border-border bg-background text-text-primary"
      />
      <input
        placeholder="URL"
        value={form.url}
        onChange={(e) => setForm({ ...form, url: e.target.value })}
        className="w-full p-2 rounded border border-border bg-background text-text-primary"
      />
      <input
        placeholder="Topic (e.g. React)"
        value={form.topic}
        onChange={(e) => setForm({ ...form, topic: e.target.value })}
        className="w-full p-2 rounded border border-border bg-background text-text-primary"
      />
      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        className="w-full p-2 rounded border border-border bg-background text-text-primary"
      >
        {["Link", "Document", "Video"].map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <button
        type="submit"
        className="w-full py-2 rounded font-semibold text-obsidian bg-gradient-to-r from-gold to-emerald"
      >
        Add Resource
      </button>
    </form>
  );
}
